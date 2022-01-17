import Auth from "../../utils/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { Collection } from "../../interfaces/Builds";
import ModalContainer from "../../containers/ModalContainer";
import messages from "../../constants/messages";
import Status from "../statuses/Status";
import Table from "../common/Table";
import Button from "../common/Button";
import Separator from "../utils/Separator";
import Input from "../common/Input";

const CollectionsManager = ({ showMenu, setShowMenu, setCollection }) => {
  const [data, setData] = useState<Collection[] | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const userObject = Auth.getUser();

  const fetchData = () => {
    axios
      .get(
        process.env.BACKEND_ENDPOINT + `/user/${userObject?.uuid}/collections`
      )
      .then((res) => {
        setData(res.data || []);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (userObject?.token) {
      fetchData();
    }
  }, []);

  const createCollection = (e) => {
    e.preventDefault();
    axios
      .post(
        process.env.BACKEND_ENDPOINT +
          `/collections/create?token=${userObject?.token}`,
        {
          name: newCollectionName,
          description: newCollectionDescription,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          fetchData();
        }
      })
      .catch((err) => {});
  };

  const deleteCollection = (collectionId) => (e) => {
    e.preventDefault();
    axios
      .delete(
        process.env.BACKEND_ENDPOINT +
          `/collections/${collectionId}/delete?token=${userObject?.token}`
      )
      .then((res) => {
        if (res.status === 200) {
          fetchData();
        }
      })
      .catch((err) => {});
  };

  const selectCollection = (collection: Collection) => (e) => {
    e.preventDefault();
    setCollection(collection);
    setShowMenu(false);
  };

  if (!showMenu) return null;

  if (!data) {
    return (
      <ModalContainer close={() => setShowMenu(false)} splash>
        <Status>
          <h2>{messages.loading}</h2>
        </Status>
      </ModalContainer>
    );
  }

  const tableData = {
    rows: data.map((collection: Collection, index) => [
      {
        content: <Button onClick={selectCollection(collection)}>Select</Button>,
      },
      {
        content: (
          <span title={collection.name} className="collection-name">
            {collection.name}
          </span>
        ),
      },
      {
        content: (
          <span
            title={collection.description}
            className="collection-description"
          >
            {collection.description}
          </span>
        ),
      },
      {
        content: (
          <Button onClick={deleteCollection(collection.id)}>Remove</Button>
        ),
      },
    ]),
  };

  return (
    <ModalContainer close={() => setShowMenu(false)}>
      <h2>Collections</h2>
      <Table data={tableData} />
      {Separator}
      <h3>Create a New Collection</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="section">
          <label>Collection Details</label>
          <Input
            placeholder="Name"
            value={newCollectionName}
            setValue={setNewCollectionName}
          />
          <Input
            placeholder="Description"
            value={newCollectionDescription}
            setValue={setNewCollectionDescription}
            height="5em"
            textArea
          />
        </div>
        <div className="section">
          <div className="create">
            <Button onClick={createCollection} primary>
              Create
            </Button>
          </div>
        </div>
      </form>

      <style jsx>{`
        h2 {
          margin-bottom: 1em;
        }

        :global(.table) {
          grid-template-columns: min-content max-content 2fr min-content !important;
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

        .section > :global(.input):first-of-type {
          margin-bottom: 0.5em;
        }

        :global(.collection-description) {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .create {
          max-width: 150px;
          margin: 1em 0;
        }
      `}</style>
    </ModalContainer>
  );
};

export default CollectionsManager;
