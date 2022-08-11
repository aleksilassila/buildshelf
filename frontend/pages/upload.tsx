import Navbar from "../components/navbar/Navbar";
import { AxiosResponse } from "axios";
import Input from "../components/ui/Input";
import FileSelect from "../components/ui/FileSelect";
import PrimaryButton from "../components/ui/button/Button";
import theme from "../constants/theme";
import Tag from "../components/ui/Tag";
import * as Form from "../components/form/Form";
import FormMarkdownEditor from "../components/form/FormMarkdownEditor";
import ImageUpload from "../components/form/ImageUpload";
import { Toast, useToast } from "../components/ui/Toast";
import { Build, Category, Collection, Image } from "../interfaces/ApiResponses";
import * as AlertDialog from "../components/ui/AlertDialog";
import { useRouter } from "next/router";
import * as Dropdown from "../components/ui/Dropdown";
import { apiRequest, useApi } from "../utils/api";
import { useLocalUser } from "../utils/auth";
import LoadingButton from "../components/ui/button/LoadingButton";
import { useState } from "react";

interface FormData {
  name: string;
  description: string;
  buildFile: File | null;
  tags: string[];
  tagsInput: string;
  images: Image[];
  categoryName: string;
  collection: {
    action: "none" | "existing" | "new";
    description: string;
    id: string;
    name: string;
  };
}

const initialFormData: FormData = {
  name: "",
  description: "",
  buildFile: null,
  tags: [],
  tagsInput: "",
  images: [],
  categoryName: "",
  collection: {
    name: "",
    id: "",
    description: "",
    action: "none",
  },
};

const Clear = ({ setFormData }) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger>
      <PrimaryButton mode="danger">Clear</PrimaryButton>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.ConfirmDangerous
        onConfirm={() => setFormData(initialFormData)}
      />
    </AlertDialog.Content>
  </AlertDialog.Root>
);

const Upload = () => {
  const localUser = useLocalUser();
  const router = useRouter();
  const [formData, setFormData, changeField] = Form.useFormData<FormData>(
    initialFormData,
    "uploadFormData"
  );
  const [isLoading, setIsLoading] = useState(false);

  const [categories, categoriesLoading, categoriesError] = useApi<Category[]>(
    "/categories",
    {},
    []
  );

  const [collections, collectionsLoading, collectionsError] = useApi<
    Collection[]
  >(
    "/collections/search",
    {
      params: {
        uuid: localUser?.uuid,
      },
    },
    []
  );

  // Toast props
  const [toast, toastProps] = useToast();

  if (formData === null) return <div />;

  const submitData = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("buildFile", formData.buildFile);

    for (const image of formData.images) {
      data.append("imageIds[]", image.id.toString());
    }

    if (formData.categoryName.length > 0) {
      data.append("categoryName", formData.categoryName);
    }

    if (formData.collection.action === "existing") {
      data.append("collectionId", formData.collection.id);
    } else if (formData.collection.action === "new") {
      data.append("collectionName", formData.collection.name);
      data.append("collectionDescription", formData.collection.description);
    }

    for (const tag of formData.tags) {
      data.append("tags[]", tag);
    }

    setIsLoading(true);
    apiRequest({
      method: "POST",
      url: "/builds",
      data,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res: AxiosResponse<Build>) => {
        toast("Build Created", "Build created successfully.", "primary");
        setFormData(initialFormData);
        if (res.data?.id) {
          router.push("/builds/" + res.data?.id).then();
        }
      })
      .catch((err) => toast("Error Occurred", err?.message, "danger"))
      .finally(() => setIsLoading(false));
  };

  const addTag = (e) => {
    e.preventDefault();
    const tags = formData.tags;

    if (formData.tagsInput.length === 0) return;

    if (tags.length < 3 && !tags.includes(formData.tagsInput)) {
      tags.push(formData.tagsInput);
    }

    setFormData({
      ...formData,
      tags,
      tagsInput: "",
    });
  };

  const removeTag = (tagName) => (e) => {
    e.preventDefault();
    if (formData.tags.includes(tagName)) {
      const tags = formData.tags;
      tags.splice(tags.indexOf(tagName), 1);
      setFormData({
        ...formData,
        tags,
      });
    }
  };

  const setCollection = (collection) => {
    setFormData({
      ...formData,
      collectionId: collection.id,
      collectionName: collection.name,
    });
  };

  const setCategory = (categoryName) => {
    setFormData({
      ...formData,
      categoryName,
    });
  };

  if (localUser === undefined) return;

  if (localUser === null) {
    return (
      <div className="login-error">
        <span>You must be logged in to upload.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar active="/upload" />
      <Form.Root>
        <Form.Section>
          <h2 className={theme.text.bold}>Upload a build</h2>
        </Form.Section>
        <Form.Section>
          <Form.Label htmlFor="name">
            <Form.LabelText>Title</Form.LabelText>
            <Input
              id="name"
              value={formData.name}
              setValue={changeField("name")}
              placeholder="Name"
            />
          </Form.Label>
        </Form.Section>
        <Form.Section>
          <Form.LabelText>Description</Form.LabelText>
          <FormMarkdownEditor
            placeholder="Description"
            setValue={changeField("description")}
            value={formData.description}
          />
          <Form.Tip>
            Supports{" "}
            <a
              href="https://www.markdownguide.org/cheat-sheet/"
              className={theme.text.link}
            >
              markdown
            </a>{" "}
            syntax
          </Form.Tip>
        </Form.Section>
        <Form.Section>
          <Form.LabelText>Build File</Form.LabelText>
          <FileSelect
            files={formData.buildFile}
            setFiles={(files) => changeField("buildFile")(files[0])}
            accept=".litematic, application/gzip"
            className="max-w-min"
          />
          <Form.Tip>Supported extensions: .litematica</Form.Tip>
        </Form.Section>
        <Form.Section>
          <Form.LabelText>Images</Form.LabelText>
          <ImageUpload
            initialImages={formData.images}
            uploadCallback={(res, images) => {
              if (res?.status === 200) {
                changeField("images")(images);
              }
            }}
          />
          <Form.Tip>
            Upload max 5 images. It is good practice to use shaders and low FOV
            of less than 60 when taking the screenshots.
          </Form.Tip>
          <Form.Tip>Supported extensions: .png, .jpg</Form.Tip>
        </Form.Section>
        <Form.Section>
          <div className="mb-2 flex flex-row gap-3">
            <Form.LabelText className="mb-0">Tags</Form.LabelText>
            <Tag.Root>
              {formData.tags.map((tag, index) => (
                <Tag.Item onRemove={removeTag(tag)}>{tag}</Tag.Item>
              ))}
            </Tag.Root>
          </div>
          <div className="input-button-container">
            <Input
              value={formData.tagsInput}
              setValue={changeField("tagsInput")}
              placeholder="Tag Name"
              onEnter={(tag) => {
                if (formData.tags?.length < 3) addTag(tag);
              }}
            />
            <PrimaryButton
              onClick={addTag}
              mode={
                formData.tags?.length >= 3 || formData.tagsInput.length === 0
                  ? "disabled"
                  : "primary"
              }
            >
              Add
            </PrimaryButton>
          </div>
          <Form.Tip>
            Add up to three tags. Tags should be adjectives that describe your
            building. For example: diagonal, medieval, easy
          </Form.Tip>
        </Form.Section>
        <Form.Section>
          <Form.LabelText>Category</Form.LabelText>
          <Dropdown.Root onValueChange={setCategory} defaultValue="">
            <Dropdown.Group>
              <Dropdown.Label>Category</Dropdown.Label>
              <Dropdown.Item value="">None</Dropdown.Item>
              {categories?.map((item, index) => (
                <Dropdown.Item key={index} value={item.name}>
                  {item.name
                    ?.split("-")
                    ?.map((w) => w[0].toUpperCase() + w.slice(1))
                    ?.join(" ")}
                </Dropdown.Item>
              ))}
            </Dropdown.Group>
          </Dropdown.Root>
        </Form.Section>
        {/*<Form.Section>*/}
        {/*  <Form.LabelText>Add to a Build Collection</Form.LabelText>*/}
        {/*  <RadioAccordion.Root*/}
        {/*    defaultValue={formData.collection.action}*/}
        {/*    onValueChange={(action) =>*/}
        {/*      setFormData({*/}
        {/*        ...formData,*/}
        {/*        collection: { ...formData.collection, action },*/}
        {/*      })*/}
        {/*    }*/}
        {/*  >*/}
        {/*    <RadioAccordion.Item value="none">*/}
        {/*      <RadioAccordion.Trigger value="none">None</RadioAccordion.Trigger>*/}
        {/*      <RadioAccordion.Content>*/}
        {/*        Don't add the build to a collection.*/}
        {/*      </RadioAccordion.Content>*/}
        {/*    </RadioAccordion.Item>*/}
        {/*    <RadioAccordion.Item value="existing">*/}
        {/*      <RadioAccordion.Trigger value="existing">*/}
        {/*        Existing Collection*/}
        {/*      </RadioAccordion.Trigger>*/}
        {/*      <RadioAccordion.Content>*/}
        {/*        {collections?.length ? (*/}
        {/*          <div>*/}
        {/*            <Form.LabelText>*/}
        {/*              Add the build to an exising collection*/}
        {/*            </Form.LabelText>*/}
        {/*            <RadioGroup.Root*/}
        {/*              onValueChange={(id) =>*/}
        {/*                setFormData({*/}
        {/*                  ...formData,*/}
        {/*                  collection: { ...formData.collection, id },*/}
        {/*                })*/}
        {/*              }*/}
        {/*            >*/}
        {/*              {collections?.map((collection, key) => (*/}
        {/*                <RadioGroup.Item*/}
        {/*                  className="gap-2"*/}
        {/*                  key={key}*/}
        {/*                  value={`${collection.id}`}*/}
        {/*                >*/}
        {/*                  <span className="font-medium flex-initial">*/}
        {/*                    {collection.name}*/}
        {/*                  </span>*/}
        {/*                  <span className="text-left flex-auto">*/}
        {/*                    {collection.description}*/}
        {/*                  </span>*/}
        {/*                  <span className="text-stone-600 text-sm flex-initial">*/}
        {/*                    {collection.builds?.length} builds*/}
        {/*                  </span>*/}
        {/*                </RadioGroup.Item>*/}
        {/*              ))}*/}
        {/*            </RadioGroup.Root>*/}
        {/*          </div>*/}
        {/*        ) : (*/}
        {/*          <div>You don't seem to have any existing collections.</div>*/}
        {/*        )}*/}
        {/*      </RadioAccordion.Content>*/}
        {/*    </RadioAccordion.Item>*/}
        {/*    <RadioAccordion.Item value="new">*/}
        {/*      <RadioAccordion.Trigger value="new">*/}
        {/*        New Collection*/}
        {/*      </RadioAccordion.Trigger>*/}
        {/*      <RadioAccordion.Content>*/}
        {/*        <Form.LabelText>Create a new collection</Form.LabelText>*/}
        {/*        <RadioAccordion.Section>*/}
        {/*          Name:*/}
        {/*          <Input*/}
        {/*            value={formData.collection.name}*/}
        {/*            setValue={(name) =>*/}
        {/*              setFormData({*/}
        {/*                ...formData,*/}
        {/*                collection: { ...formData.collection, name },*/}
        {/*              })*/}
        {/*            }*/}
        {/*            placeholder="Collection Name"*/}
        {/*          />*/}
        {/*        </RadioAccordion.Section>*/}
        {/*        <RadioAccordion.Section>*/}
        {/*          Description:*/}
        {/*          <Input*/}
        {/*            value={formData.collection.description}*/}
        {/*            setValue={(description) =>*/}
        {/*              setFormData({*/}
        {/*                ...formData,*/}
        {/*                collection: { ...formData.collection, description },*/}
        {/*              })*/}
        {/*            }*/}
        {/*            placeholder="Collection Description"*/}
        {/*          />*/}
        {/*        </RadioAccordion.Section>*/}
        {/*        <RadioAccordion.Section>*/}
        {/*          Images:*/}
        {/*          <ImageUpload />*/}
        {/*        </RadioAccordion.Section>*/}
        {/*      </RadioAccordion.Content>*/}
        {/*    </RadioAccordion.Item>*/}
        {/*  </RadioAccordion.Root>*/}
        {/*</Form.Section>*/}
        <Form.Section className="flex flex-row justify-between">
          <LoadingButton
            loading={isLoading}
            onClick={submitData}
            mode="primary"
          >
            Upload
          </LoadingButton>
          <Clear setFormData={setFormData} />
        </Form.Section>
      </Form.Root>
      <Toast toastProps={toastProps} />
      <style jsx>
        {`
          .tags > :global(.table) {
            margin-bottom: 0.5em;
            grid-template-columns: 1fr max-content;
          }

          .input-button-container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }

          .input-button-container > :global(*:not(:last-child)) {
            margin-right: 0.5em;
            flex: 1 1 auto;
          }

          .upload {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }

          .upload > :global(*:first-child) {
            width: 100%;
            max-width: 150px;
          }
        `}
      </style>
    </div>
  );
};

export default Upload;
