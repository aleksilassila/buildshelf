import Auth from "../utils/auth";
import TitleBar from "../components/bars/TitleBar";
import { useEffect, useState } from "react";
import axios from "axios";
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
import Message from "../components/ui/Message";
import Styled from "../components/Styled";
import Markdown from "../components/Markdown";
import * as LabelPrimitive from "@radix-ui/react-label";
import Tag from "../components/ui/Tag";

interface FormData {
  title: string;
  description: string;
  buildFile: File | null;
  tags: string[];
  tagsInput: string;
  images: File[];
  category: string;
  collectionSearch: string;
  collectionName: string;
  collectionId: string;
  collectionDescription: string;
}

const initialFormData = {
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

const Section = ({
  children,
  htmlFor,
  className,
}: {
  children: any;
  htmlFor?: string;
  className?: string;
}) => (
  <LabelPrimitive.Root htmlFor={htmlFor} className={`py-4 mx-6 ${className}`}>
    {children}
  </LabelPrimitive.Root>
);

const Tip = Styled("text-xs text-stone-700 mt-2");
const Label = Styled("font-medium mb-2");

const Upload = () => {
  const [formData, setFormData] = useState<FormData>(
    Localstorage.get("uploadFormData") || initialFormData
  );

  const [showCollectionsManager, setShowCollectionsManager] = useState(false);
  const [showCategoryBrowser, setShowCategoryBrowser] = useState(false);

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Localstorage.set("uploadFormData", {
      ...formData,
      buildFile: initialFormData.buildFile,
      images: initialFormData.images,
    });
  }, [formData]);

  const changeField = (field) => (value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const submitData = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("buildFile", formData.buildFile);
    for (const image of formData.images) {
      data.append("images", image);
    }
    data.append("category", formData.category);
    if (formData.collectionId) {
      data.append("collectionId", formData.collectionId);
    }
    data.append("tags", formData.tags.join(","));

    axios({
      method: "POST",
      url:
        process.env.BACKEND_ENDPOINT +
        `/build/create?token=${userObject?.token}`,
      data,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        setResponse(res.data);
        setFormData(initialFormData);
      })
      .catch((err) => setError(err));
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
    console.log("Removing", tagName);
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

  // const validate = () => {
  //   const errors = [];
  //
  //   if (!formData.title) {
  //     err
  //   }
  // }

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
      <form
        onSubmit={(e) => e.preventDefault()}
        className="rounded border border-stone-200 bg-stone-100 shadow grid grid-cols-1 divide-y divide-stone-200 m-6 md:mx-auto max-w-screen-lg"
      >
        <Section>
          <h2 className={theme.text.bold}>Upload a build</h2>
        </Section>
        <Section htmlFor="title">
          <Label>Title</Label>
          <Input
            id="title"
            value={formData.title}
            setValue={changeField("title")}
            placeholder="Title"
          />
        </Section>
        <Section>
          <Label>Description</Label>
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 h-fit">
            <Input
              value={formData.description}
              setValue={changeField("description")}
              placeholder="Description"
              height="8rem"
              textArea
            />
            <Markdown className="bg-stone-50 p-2 rounded border border-stone-200 overflow-y-scroll">
              {formData.description}
            </Markdown>
          </div>
          <Tip>
            Supports{" "}
            <a
              href="https://www.markdownguide.org/cheat-sheet/"
              className="hover:underline text-green-500"
            >
              markdown
            </a>{" "}
            syntax
          </Tip>
        </Section>
        <Section>
          <Label>Build File</Label>
          <FileSelect
            files={formData.buildFile}
            setFiles={(files) => changeField("buildFile")(files[0])}
            accept=".litematic, application/gzip"
          />
          <Tip>Supported extensions: .litematica</Tip>
        </Section>
        <Section>
          <Label>Images</Label>
          <FileSelect
            files={formData.images}
            multiple={true}
            setFiles={changeField("images")}
            accept="image/png, image/jpeg, image/gif"
          />
          <Tip>Supported extensions: .png, .jpg</Tip>
        </Section>
        <Section>
          <div className="mb-2 flex flex-row gap-3">
            <Label className="mb-0">Tags</Label>
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
          <Tip>
            Add up to three tags. Tags should be adjectives that describe your
            building. For example: diagonal, medieval, easy
          </Tip>
        </Section>
        <Section>
          <Label>Category</Label>
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
          <Tip>A noun describing the type of the build.</Tip>
        </Section>
        <Section>
          <Label>Add to a Build Collection</Label>
          <div>
            <MultipleButton data={collectionsButtonData} />
          </div>
          <CollectionsManager
            showMenu={showCollectionsManager}
            setShowMenu={setShowCollectionsManager}
            setCollection={setCollection}
          />
        </Section>
        <Message visible={!!response} close={() => setResponse(null)} success>
          <span>Build created.</span>
        </Message>
        <Message visible={!!error} close={() => setError(null)} danger>
          <h3>An error occurred</h3>
          {error?.message}
        </Message>
        <Section className="flex flex-row justify-between">
          <Button onClick={submitData} primary>
            Upload
          </Button>
          <Button onClick={() => setFormData(initialFormData)} danger>
            Clear
          </Button>
        </Section>
      </form>
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: column;
            background-color: ${theme.light};
          }

          .section {
            margin: 0.5em 0;
          }

          .tip {
            font-size: 0.7em;
            color: ${theme.darkLowContrast};
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
