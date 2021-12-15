import Auth from "../utils/auth";
import TitleBar from "../components/TitleBar";
import {useState} from "react";
import FormInput from "../components/forms/FormInput";
import theme from "../constants/theme";
import axios from "axios";
import ManageCollections from "../components/forms/ManageCollections";
import {Collection} from "../interfaces/Builds";

const CustomInput = ({ value, setValue, placeholder, type = "text" }) => {
    return <div>
        <input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} type={type} />
        <style jsx>
            {`
                input {
                    
                }
            `}
        </style>
    </div>
}

const CustomFileInput = ({ setFiles, multiple = false }) => {
    return <div>
        <input type="file" onChange={e => setFiles(e.target.files)} multiple={multiple}/>
        <style jsx>
            {`
                input {
                    
                }
            `}
        </style>
    </div>
}

const CollectionSearchInput = ({ placeholder, setCollection, type = "text" }) => {
    const [searchValue, setSearchValue] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [searchData, setSearchData] = useState([]);

    const userObject = Auth.getUser();

    const doSearch = (searchQuery) => () => {
        if (!searchQuery) return;

        axios.get(process.env.BACKEND_ENDPOINT +
            `/collections/find?token=${userObject?.token}&searchQuery=${searchQuery}`)
            .then(res => {
                setSearchData(res.data || []);
            }).catch(err => {});
    }

    return <div className="container"
                // onFocus={() => setShowSearch(true)}
                // onBlur={() => {
                //     setShowSearch(false);
                //     setSearchData([]);
                // }}
                >
        <input
            value={searchValue}
            onChange={e => {
                setSearchValue(e.target.value);
                if (typingTimeout !== null) {
                    window.clearTimeout(typingTimeout);
                }
                setTypingTimeout(window.setTimeout(doSearch(e.target.value), 800));
            }}
            placeholder={placeholder}
            type={type} />
        {showSearch ? <div className="search">{
            searchData.map((collection, index) =>
                <span key={index} onClick={() => {
                    setCollection(collection);
                    setShowSearch(false);
                }}>{collection?.name}</span>)
        }</div> : null}
        <style jsx>{`
            .container {
                
            }
            
            input {
                
            }
            
        `}</style>
    </div>
}

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
    }

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
            method: 'POST',
            url: process.env.BACKEND_ENDPOINT + `/build/create?token=${userObject?.token}`,
            data,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(res => setResponse(res.data));

    }

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
    }

    const removeTag = (tagName) => (e) => {
        e.preventDefault();
        console.log("Removing", tagName)
        if (formData.tags.includes(tagName)) {
            const tags = formData.tags;
            tags.splice(tags.indexOf(tagName), 1);
            setFormData({
                ...formData,
                tags,
            })
        }
    }

    const setCollection = (collection) => {
        setFormData({
            ...formData,
            collectionId: collection.id,
            collectionName: collection.name,
        })
    }

    const userObject = Auth.getUser();

    if (!userObject) {
        return <div className="login-error">
            <span>You must be logged in to upload.</span>
        </div>
    }

    return <div className="container">
        <TitleBar active="upload" />
        <form onSubmit={submitData}>
            <h3>Upload a build</h3>
            <label>Title</label>
            <CustomInput
                value={formData.title}
                setValue={changeField("title")}
                placeholder="Title" />
            <label>Description</label>
            <CustomInput
                value={formData.description}
                setValue={changeField("description")}
                placeholder="Description" />
            <label>Build File</label>
            <CustomFileInput setFiles={files => changeField("buildFile")(files[0])} />
            <label>Images</label>
            <CustomFileInput multiple={true} setFiles={changeField("images")} />
            <label>Tags</label>
            <label>{formData.tags
                .map((tag, index) => <span key={index} onClick={removeTag(tag)}>{tag}</span>)}</label>
            <CustomInput
                value={formData.tagsInput}
                setValue={changeField("tagsInput")}
                placeholder="Tag Name" />
            <button onClick={addTag}>Add</button>
            <label>Category</label>
            <CustomInput
                value={formData.category}
                setValue={changeField("category")}
                placeholder="Category Path" />
            <label>Collection</label>
            <CollectionSearchInput
                placeholder="Search Collections"
                setCollection={setCollection} />
            <button type="button" onClick={() => setShowCollectionsManager(true)}>Manage Collections</button>
            <ManageCollections
                showMenu={showCollectionsManager}
                setShowMenu={setShowCollectionsManager}
                setCollection={setCollection} />
            {formData.collectionName}
            <button type="submit">Upload</button>
        </form>
        <div>{response}</div>
        <style jsx>
            {`
                form {
                    margin: 2em;
                    padding: 1em;
                    display: flex;
                    flex-direction: column;
                    border-radius: 4px;
                    background-color: ${theme.lowContrastDark};
                }
                
                form h3 {
                    margin-bottom: 2em;
                }
                
                label {

                }
            `}
        </style>
    </div>;
}

export default Upload;