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
import { Toast, useToast } from "../../../components/ui/Toast";
import ImageUpload from "../../../components/form/ImageUpload";
import * as AlertDialog from "../../../components/ui/AlertDialog";
import Auth from "../../../utils/auth";

interface FormData {
  description: string;
  images: Image[];
}

const Edit = () => {
  const router = useRouter();
  const { buildId } = router.query;
  const user = Auth.getUser();

  const [toast, toastProps] = useToast();
  const [formData, setFormData, changeField] = UseFormData<FormData>({
    description: "",
    images: [],
  });

  const [build, loading, error] = useApi<Build>("/builds/" + buildId, {}, [
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
      url: "/builds/" + buildId,
      data: {
        description: formData.description,
        imageIds: formData.images.map((image) => image.id.toString()),
      },
    }).then((res) => {
      if (res.status === 200) {
        toast("Build updated", "Build updated successfully.", "primary", () => {
          router.push("/builds/" + buildId).then();
        });
      } else {
        toast("Error", "Could not update build.", "danger");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TitleBar />
      <Form.Root>
        <Form.Label className="flex flex-row justify-between items-end">
          <h2 className="font-bold text-2xl">Edit build {build.title}</h2>
          <a href={"/builds/" + buildId}>
            <Button onClick={() => {}}>View Build Page</Button>
          </a>
        </Form.Label>
        <Form.Label>
          <Form.LabelText>Update Description</Form.LabelText>
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
        </Form.Label>
        <Form.Label>
          <ImageUpload
            initialImages={build.images}
            uploadCallback={(res, images) => {
              setFormData({
                ...formData,
                images,
              });
            }}
          />
        </Form.Label>
        <Form.Label className="flex justify-between">
          <Button onClick={submitData} className="float-left" mode="primary">
            Update Build
          </Button>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button mode="danger">Delete</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.ConfirmDangerous
                onConfirm={() => {
                  apiRequest({
                    method: "delete",
                    url: "/builds/" + buildId,
                  }).then((res) => {
                    if (res.status === 200) {
                      toast(
                        "Build deleted",
                        "Build deleted successfully.",
                        "primary",
                        () => {
                          router
                            .push(user?.uuid ? "/users/" + user?.uuid : "/")
                            .then();
                        }
                      );
                    } else {
                      toast("Error", "Could not delete build.", "danger");
                    }
                  });
                }}
              />
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Form.Label>
      </Form.Root>
      <Toast toastProps={toastProps} />
    </div>
  );
};

export default Edit;
