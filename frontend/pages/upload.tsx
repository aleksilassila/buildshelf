import Auth from "../utils/auth";
import TitleBar from "../components/TitleBar";
import { useState } from "react";
import axios from "axios";
import ManageCollections from "../components/forms/ManageCollections";
import Separator from "../components/icons/Separator";
import Input from "../components/common/Input";
import FileSelect from "../components/common/FileSelect";
import Table, { TableData } from "../components/common/Table";
import Button from "../components/common/Button";

const CollectionSearchInput = ({
  placeholder,
  setCollection,
  type = "text",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [searchData, setSearchData] = useState([]);

  const userObject = Auth.getUser();

  const doSearch = (searchQuery) => () => {
    if (!searchQuery) return;

    axios
      .get(
        process.env.BACKEND_ENDPOINT +
          `/collections/find?token=${userObject?.token}&searchQuery=${searchQuery}`
      )
      .then((res) => {
        setSearchData(res.data || []);
      })
      .catch((err) => {});
  };

  return (
    <div
      className="container"
      // onFocus={() => setShowSearch(true)}
      // onBlur={() => {
      //     setShowSearch(false);
      //     setSearchData([]);
      // }}
    >
      <input
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          if (typingTimeout !== null) {
            window.clearTimeout(typingTimeout);
          }
          setTypingTimeout(window.setTimeout(doSearch(e.target.value), 800));
        }}
        placeholder={placeholder}
        type={type}
      />
      {showSearch ? (
        <div className="search">
          {searchData.map((collection, index) => (
            <span
              key={index}
              onClick={() => {
                setCollection(collection);
                setShowSearch(false);
              }}
            >
              {collection?.name}
            </span>
          ))}
        </div>
      ) : null}
      <style jsx>{`
        .container {
        }

        input {
        }
      `}</style>
    </div>
  );
};

const Upload = () => {
  const [formData, setFormData] = useState({
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
  });
  const [response, setResponse] = useState("");
  const [showCollectionsManager, setShowCollectionsManager] = useState(false);

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
    data.append("collectionId", formData.collectionId);
    data.append("tags", formData.tags.join(","));

    axios({
      method: "POST",
      url:
        process.env.BACKEND_ENDPOINT +
        `/build/create?token=${userObject?.token}`,
      data,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => setResponse(res.data));
  };

  const addTag = (e) => {
    e.preventDefault();
    const tags = formData.tags;

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
      { content: <Button onClick={removeTag(tag)}>–</Button> },
      { content: <span>{tag}</span> },
    ]),
    horizontalBorders: true,
    verticalBorders: true,
  };

  return (
    <div className="container">
      <TitleBar active="upload" />
      <form onSubmit={submitData}>
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
          />
        </div>
        <div className="section">
          <label>Images</label>
          <FileSelect
            files={formData.images}
            multiple={true}
            setFiles={changeField("images")}
          />
        </div>
        <div className="section tags">
          <label>Tags</label>
          <Table data={tagsTableData} />
          <div className="add-tags">
            <Input
              value={formData.tagsInput}
              setValue={changeField("tagsInput")}
              placeholder="Tag Name"
            />
            <Button onClick={addTag}>Add</Button>
          </div>
        </div>
        <div className="section">
          <label>Category</label>
          <Input
            value={formData.category}
            setValue={changeField("category")}
            placeholder="Category Path"
          />
        </div>
        <div className="section">
          <label>Collection</label>
          <CollectionSearchInput
            placeholder="Search Collections"
            setCollection={setCollection}
          />
          <button type="button" onClick={() => setShowCollectionsManager(true)}>
            Manage Collections
          </button>
          <ManageCollections
            showMenu={showCollectionsManager}
            setShowMenu={setShowCollectionsManager}
            setCollection={setCollection}
          />
          {formData.collectionName}
        </div>
        <div className="section">
          <button type="submit">Upload</button>
        </div>
      </form>
      <div>{response}</div>
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: column;
          }

          form {
            margin: 2em auto;
            padding: 1em;
            display: flex;
            flex-direction: column;
            max-width: 700px;
            width: 100%;
          }

          form h3 {
            margin-bottom: 2em;
          }

          label {
            font-weight: 500;
            margin-bottom: 0.3em;
            display: inline-block;
          }

          .section {
            margin: 0.5em 0;
          }
          
          .tags > :global(table) {
            margin-bottom: 0.5em;
          }

          .add-tags {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }

          .add-tags > :global(*:not(:last-child)) {
            margin-right: 0.5em;
            flex: 1 0 auto;
          }
        `}
      </style>
    </div>
  );
};

export default Upload;
