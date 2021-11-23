import Auth from "../../utils/auth";
import {useEffect, useState} from "react";
import axios from "axios";
import theme from "../../theme";
import {Collection} from "../../interfaces/Builds";

const Container = ({ children, setShowMenu }) => <div className="container">
    <div className="title-bar">
        <span>Manage Collections</span>
        <span onClick={() => setShowMenu(false)}>close</span>
    </div>
    {children}
    <style jsx>{`
        .container {
            background-color: ${theme.highContrastDark};
        }
        
        .title-bar {
            background-color: ${theme.lowContrastDark};
        }
    `}</style>
</div>

const ManageCollections = ({ showMenu, setShowMenu }) => {
    const [data, setData] = useState<Collection[] | null>(null);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [newCollectionDescription, setNewCollectionDescription] = useState("");
    const userObject = Auth.getUser();

    const fetchData = () => {
        axios.get(process.env.BACKEND_ENDPOINT +
            `/user/${userObject?.id}/collections`)
            .then(res => {
                setData(res.data || []);
            }).catch(err => {});
    }

    useEffect(() => {
        if (userObject?.token) {
            fetchData();
        }
    }, []);

    const createCollection = (e) => {
        e.preventDefault();
        axios.get(process.env.BACKEND_ENDPOINT +
            `/collections/create?token=${userObject?.token}` +
            `&name=${newCollectionName}&description=${newCollectionDescription}`)
            .then(res => {
                if (res.status === 200) {
                    fetchData();
                }
            }).catch(err => {});
    }

    const deleteCollection = (collectionId) => (e) => {
        e.preventDefault();
        axios.delete(process.env.BACKEND_ENDPOINT +
                `/collections/${collectionId}/delete?token=${userObject?.token}`)
            .then(res => {
                if (res.status === 200) {
                    fetchData();
                }
            }).catch(err => {});
    }

    if (!data) {
        return <Container setShowMenu={setShowMenu}>
            <div>Loading...</div>
        </Container>
    }

    if (!showMenu) return null;
    return <Container setShowMenu={setShowMenu}>
        <span>Collections</span>
        {data.map((collection: Collection, index) => <div key={index}>
            {collection.name}
            <span onClick={deleteCollection(collection.id)}>Delete</span>
        </div>)}
        <span>Create a New Collection</span>
        <input type="text"
               placeholder="Collection Name"
               value={newCollectionName}
               onChange={(e) => setNewCollectionName(e.target.value)} />
        <input type="text"
               placeholder="Collection Description"
               value={newCollectionDescription}
               onChange={(e) => setNewCollectionDescription(e.target.value)} />
        <button type="button" onClick={createCollection}>Create</button>
    </Container>
}

export default ManageCollections;