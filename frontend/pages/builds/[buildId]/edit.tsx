import Navbar from "../../../components/navbar/Navbar";
import { useRouter } from "next/router";
import { apiRequest, useApi } from "../../../utils/api";
import { Build, Image } from "../../../interfaces/ApiResponses";
import Loading from "../../../components/statuses/Loading";
import NetworkError from "../../../components/statuses/NetworkError";
import * as Form from "../../../components/form/Form";
import PrimaryButton from "../../../components/ui/button/Button";
import FormMarkdownEditor from "../../../components/form/FormMarkdownEditor";
import { useEffect } from "react";
import { Toast, useToast } from "../../../components/ui/Toast";
import ImageUpload from "../../../components/form/ImageUpload";
import * as AlertDialog from "../../../components/ui/AlertDialog";
import theme from "../../../constants/theme";
import { useLocalUser } from "../../../utils/auth";

interface FormData {
  description: string;
  images: Image[];
}

const Edit = () => {
  const router = useRouter();
  const { buildId } = router.query;
  const localUser = useLocalUser();

  const [toast, toastProps] = useToast();
  const [formData, setFormData, changeField] = Form.useFormData<FormData>({
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
        images: build.images,
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
        imageIds: formData.images.map((image) => image.id?.toString()),
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
      <Navbar />
      <Form.Root>
        <Form.Section className="flex flex-row justify-between items-end">
          <h2 className={theme.text.bold}>Edit build {build.name}</h2>
          <a href={"/builds/" + buildId}>
            <PrimaryButton onClick={() => {}}>View Build Page</PrimaryButton>
          </a>
        </Form.Section>
        <Form.Section>
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
        </Form.Section>
        <Form.Section>
          <ImageUpload
            initialImages={build.images}
            uploadCallback={(res, allRemoteImages) => {
              setFormData({
                ...formData,
                images: allRemoteImages,
              });
            }}
          />
        </Form.Section>
        <Form.Section className="flex justify-between">
          <PrimaryButton
            onClick={submitData}
            className="float-left"
            mode="primary"
          >
            Update Build
          </PrimaryButton>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <PrimaryButton mode="danger">Delete</PrimaryButton>
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
                            .push(
                              localUser?.uuid
                                ? "/users/" + localUser?.uuid
                                : "/"
                            )
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
        </Form.Section>
      </Form.Root>
      <Toast toastProps={toastProps} />
    </div>
  );
};

export default Edit;
