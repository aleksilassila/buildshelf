import Auth from "../utils/auth";
import TitleBar from "../components/bars/TitleBar";
import { useEffect, useState } from "react";
import axios from "axios";
import CollectionsManager from "../components/modals/CollectionsManager";
import Separator from "../components/utils/Separator";
import Input from "../components/common/Input";
import FileSelect from "../components/common/FileSelect";
import Table, { TableData } from "../components/common/Table";
import Button from "../components/common/Button";
import MultipleButton, {
  MultipleButtonData,
} from "../components/common/MultipleButton";
import theme from "../constants/theme";
import CategoryBrowser from "../components/modals/CategoryBrowser";
import Localstorage from "../utils/localstorage";
import Message from "../components/common/Message";

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

  const tagsTableData: TableData = {
    rows: formData.tags.map((tag, index) => [
      { content: <span>{tag}</span> },
      { content: <Button onClick={removeTag(tag)}>Remove</Button> },
    ]),
    horizontalBorders: true,
    verticalBorders: true,
  };

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
    <div className="container">
      <TitleBar active="upload" />
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Upload a build</h2>
        {Separator}
        <div className="section">
          <label>Title</label>
          <Input
            value={formData.title}
            setValue={changeField("title")}
            placeholder="Title"
          />
        </div>
        <div className="section">
          <label>Description</label>
          <Input
            value={formData.description}
            setValue={changeField("description")}
            placeholder="Description"
            height="5em"
            textArea
          />
        </div>
        <div className="section">
          <label>Build File</label>
          <FileSelect
            files={formData.buildFile}
            setFiles={(files) => changeField("buildFile")(files[0])}
            accept=".litematic, application/gzip"
          />
          <span className="tip">Supported extensions: .litematica</span>
        </div>
        <div className="section">
          <label>Images</label>
          <FileSelect
            files={formData.images}
            multiple={true}
            setFiles={changeField("images")}
            accept="image/png, image/jpeg, image/gif"
          />
          <span className="tip">Supported extensions: .png, .jpg</span>
        </div>
        <div className="section tags">
          <label>Tags</label>
          <Table data={tagsTableData} />
          <div className="input-button-container">
            <Input
              value={formData.tagsInput}
              setValue={changeField("tagsInput")}
              placeholder="Tag Name"
              onEnter={addTag}
            />
            <Button onClick={addTag}>Add</Button>
          </div>
          <span className="tip">
            Add up to three tags. Tags should be adjectives that describe your
            building. For example: diagonal, medieval, easy
          </span>
        </div>
        <div className="section">
          <label>Category</label>
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
          <span className="tip">A noun describing the type of the build.</span>
        </div>
        <div className="section">
          <label>Add to a Build Collection</label>
          <div>
            <MultipleButton data={collectionsButtonData} />
          </div>
          <CollectionsManager
            showMenu={showCollectionsManager}
            setShowMenu={setShowCollectionsManager}
            setCollection={setCollection}
          />
        </div>
        <Message visible={!!response} close={() => setResponse(null)} success>
          <span>Build created.</span>
        </Message>
        <Message visible={!!error} close={() => setError(null)} danger>
          <h3>An error occurred</h3>
          {error?.message}
        </Message>
        {Separator}
        <div className="section upload">
          <Button onClick={submitData} primary>
            Upload
          </Button>
          <Button onClick={() => setFormData(initialFormData)} danger>
            Clear
          </Button>
        </div>
      </form>
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: column;
            background-color: ${theme.light};
          }

          form {
            padding: 2em;
            border-radius: 4px;
            border: 1px solid ${theme.lightMediumContrast};
            background-color: ${theme.lightHighContrast};
            margin: 2em auto;
            display: flex;
            flex-direction: column;
            max-width: 700px;
            width: 100%;
          }

          label {
            font-weight: 500;
            margin-bottom: 0.3em;
            display: inline-block;
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
