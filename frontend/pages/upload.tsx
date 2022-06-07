import Auth from "../utils/auth";
import TitleBar from "../components/bars/TitleBar";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import CollectionsManager from "../components/modals/CollectionsManager";
import Input from "../components/ui/Input";
import FileSelect from "../components/ui/FileSelect";
import Button from "../components/ui/Button";
import MultipleButton, {
  MultipleButtonData,
} from "../components/ui/MultipleButton";
import theme from "../constants/theme";
import CategoryBrowser from "../components/modals/CategoryBrowser";
import Localstorage from "../utils/localstorage";
import Tag from "../components/ui/Tag";
import * as Form from "../components/form/Form";
import useFormData from "../hooks/useFormData";
import FormMarkdownEditor from "../components/form/FormMarkdownEditor";
import ImageUpload from "../components/form/ImageUpload";
import { Toast, useToast } from "../components/ui/Toast";
import { Build, Image } from "../interfaces/ApiResponses";
import * as AlertDialog from "../components/ui/AlertDialog";
import { useRouter } from "next/router";

interface FormData {
  title: string;
  description: string;
  buildFile: File | null;
  tags: string[];
  tagsInput: string;
  images: Image[];
  category: string;
  collectionSearch: string;
  collectionName: string;
  collectionId: string;
  collectionDescription: string;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  buildFile: null,
  tags: [],
  tagsInput: "",
  images: [],
  category: "",
  collectionSearch: "",
  collectionName: "",
  collectionId: "",
  collectionDescription: "",
};

const Clear = ({ setFormData }) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger>
      <Button mode="danger">Clear</Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.ConfirmDangerous />
      <div className="flex gap-4">
        <AlertDialog.Action onClick={() => setFormData(initialFormData)}>
          <Button mode="primary" onClick={() => setFormData(initialFormData)}>
            Clear
          </Button>
        </AlertDialog.Action>
        <AlertDialog.Cancel>
          <Button>Cancel</Button>
        </AlertDialog.Cancel>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Root>
);

const Upload = () => {
  const [formData, setFormData, changeField] = useFormData<FormData>(
    initialFormData,
    "uploadFormData"
  );

  // Toast props
  const [toast, toastProps] = useToast();

  const [showCollectionsManager, setShowCollectionsManager] = useState(false);
  const [showCategoryBrowser, setShowCategoryBrowser] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      Localstorage.set("uploadFormData", {
        ...formData,
        buildFile: initialFormData.buildFile,
      });
    }
  }, [formData]);

  if (formData === null) return <div />;

  const submitData = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("buildFile", formData.buildFile);

    for (const image of formData.images) {
      data.append("imageIds[]", image.id.toString());
    }

    data.append("category", formData.category);

    if (formData.collectionId) {
      data.append("collectionId", formData.collectionId);
    }

    for (const tag of formData.tags) {
      data.append("tags[]", tag);
    }

    axios({
      method: "POST",
      url:
        process.env.BACKEND_ENDPOINT +
        `/build/create?token=${userObject?.token}`,
      data,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res: AxiosResponse<Build>) => {
        toast("Build Created", "Build created successfully.", "primary");
        setFormData(initialFormData);
        if (res.data?.id) {
          router.push("/build/" + res.data?.id).then();
        }
      })
      .catch((err) => toast("Error Occurred", err?.message, "danger"));
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

  const setCategory = (category) => {
    setFormData({
      ...formData,
      category,
    });
  };

  const userObject = Auth.getUser();

  if (userObject === undefined) return;

  if (userObject === null) {
    return (
      <div className="login-error">
        <span>You must be logged in to upload.</span>
      </div>
    );
  }

  const collectionsButtonData: MultipleButtonData[] = [
    {
      content: formData.collectionName || "No collection selected",
      active: true,
    },
    {
      content: "Select a collection",
      onClick: () => setShowCollectionsManager(true),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <TitleBar active="upload" />
      <Form.Root>
        <Form.Section>
          <h2 className={theme.text.bold}>Upload a build</h2>
        </Form.Section>
        <Form.Section htmlFor="title">
          <Form.Label>Title</Form.Label>
          <Input
            id="title"
            value={formData.title}
            setValue={changeField("title")}
            placeholder="Title"
          />
        </Form.Section>
        <Form.Section>
          <Form.Label>Description</Form.Label>
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
          <Form.Label>Build File</Form.Label>
          <FileSelect
            files={formData.buildFile}
            setFiles={(files) => changeField("buildFile")(files[0])}
            accept=".litematic, application/gzip"
          />
          <Form.Tip>Supported extensions: .litematica</Form.Tip>
        </Form.Section>
        <Form.Section>
          <Form.Label>Images</Form.Label>
          <ImageUpload
            initialImages={formData.images}
            uploadCallback={(res) => {
              if (res.status === 200) {
                changeField("images")(res.data);
              }
            }}
          />
          <Form.Tip>Supported extensions: .png, .jpg</Form.Tip>
        </Form.Section>
        <Form.Section>
          <div className="mb-2 flex flex-row gap-3">
            <Form.Label className="mb-0">Tags</Form.Label>
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
              onEnter={addTag}
            />
            <Button onClick={addTag}>Add</Button>
          </div>
          <Form.Tip>
            Add up to three tags. Tags should be adjectives that describe your
            building. For example: diagonal, medieval, easy
          </Form.Tip>
        </Form.Section>
        <Form.Section>
          <Form.Label>Category</Form.Label>
          <div className="input-button-container">
            <Input
              value={formData.category}
              setValue={changeField("category")}
              placeholder="Category"
            />
            <Button onClick={() => setShowCategoryBrowser(true)}>
              Browse Categories
            </Button>
          </div>
          <CategoryBrowser
            show={showCategoryBrowser}
            setShow={setShowCategoryBrowser}
            setCategory={setCategory}
          />
          <Form.Tip>A noun describing the type of the build.</Form.Tip>
        </Form.Section>
        <Form.Section>
          <Form.Label>Add to a Build Collection</Form.Label>
          <div>
            <MultipleButton data={collectionsButtonData} />
          </div>
          <CollectionsManager
            showMenu={showCollectionsManager}
            setShowMenu={setShowCollectionsManager}
            setCollection={setCollection}
          />
        </Form.Section>
        <Form.Section className="flex flex-row justify-between">
          <Button onClick={submitData} mode="primary">
            Upload
          </Button>
          <Clear setFormData={setFormData} />
        </Form.Section>
      </Form.Root>
      <Toast toastProps={toastProps} />
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: column;
            background-color: ${theme.light};
          }

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
