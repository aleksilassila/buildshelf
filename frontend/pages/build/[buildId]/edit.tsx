import TitleBar from "../../../components/bars/TitleBar";
import { useRouter } from "next/router";
import { apiRequest, useApi } from "../../../utils/api";
import { Build, Image } from "../../../interfaces/ApiResponses";
import Loading from "../../../components/statuses/Loading";
import NetworkError from "../../../components/statuses/NetworkError";
import * as Form from "../../../components/form/Form";
import UseFormData from "../../../hooks/useFormData";
import Button from "../../../components/ui/Button";
import FormMarkdownEditor from "../../../components/form/FormMarkdownEditor";
import { useEffect } from "react";
import { Toast, useToast } from "../../../components/ui/toast";
import ImageUpload from "../../../components/form/ImageUpload";

interface FormData {
  description: string;
  images: Image[];
}

const Edit = () => {
  const router = useRouter();
  const { buildId } = router.query;

  const [open, toastProps] = useToast();
  const [formData, setFormData, changeField] = UseFormData<FormData>({
    description: "",
    images: [],
  });

  const [build, loading, error] = useApi<Build>("/build/" + buildId, {}, [
    buildId,
  ]);

  useEffect(() => {
    if (build) {
      setFormData({
        ...formData,
        description: build.description,
      });
    }
  }, [build]);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <NetworkError />;
  }

  const submitData = (e) => {
    e.preventDefault();

    apiRequest({
      method: "put",
      url: "/build/" + buildId,
      data: {
        description: formData.description,
        imageIds: formData.images.map((image) => image.id.toString()),
      },
    }).then((res) => {
      if (res.status === 200) {
        open("Build updated", "Build updated successfully.");
      } else {
        open("Error", "Could not update build.");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TitleBar />
      <Form.Root>
        <Form.Section className="flex flex-row justify-between items-end">
          <h2 className="font-bold text-2xl">Edit build {build.title}</h2>
          <a href={"/build/" + buildId}>
            <Button onClick={() => {}}>View Build Page</Button>
          </a>
        </Form.Section>
        <Form.Section>
          <Form.Label>Update Description</Form.Label>
          <FormMarkdownEditor
            placeholder="Description"
            setValue={changeField("description")}
            value={formData.description}
          />
          <Form.Tip>
            Supports{" "}
            <a
              href="https://www.markdownguide.org/cheat-sheet/"
              className="hover:underline text-green-500"
            >
              markdown
            </a>{" "}
            syntax
          </Form.Tip>
        </Form.Section>
        <Form.Section>
          <ImageUpload
            initialImages={build.images}
            uploadCallback={(res, images) => {
              setFormData({
                ...formData,
                images,
              });
            }}
          />
        </Form.Section>
        <Form.Section>
          <Button onClick={submitData} className="float-left" primary>
            Update Build
          </Button>
        </Form.Section>
      </Form.Root>
      <Toast toastProps={toastProps} />
    </div>
  );
};

export default Edit;
