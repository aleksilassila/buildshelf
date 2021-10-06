import useAxios from "axios-hooks";
import {Build} from "../interfaces/Builds";
import CloseIcon from "./icons/CloseIcon";
import theme from "../theme";
import ImageCollection from "./ImageCollection";
import Separator from "./icons/Separator";

interface Props {
    buildId: number,
    setBuildPage: (number) => void,
    modal: boolean,
}

const BuildPage = ({ buildId, setBuildPage, modal = true }: Props) => {
    if (buildId === undefined) return null;

    const [{ data, loading, error }, refetch] = useAxios<Build>(process.env.BACKEND_ENDPOINT + `/build/${buildId}`);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error!</p>

    const close = () => setBuildPage(undefined);

    return <div className="container">
        <div className={modal ? "modal-container" : "page-container"}>
            <h3>{data.title}</h3>
            <span>{data.description}</span>
            {Separator}
            <h3>Images</h3>
            <ImageCollection images={data.images} />
            <div className="close"><CloseIcon setBuildPage={setBuildPage} /></div>
        </div>
        <style jsx>
            {`
                .container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    height: 100vh;
                    width: 100vw;
                    background-color: #00000080;
                }
                
                .modal-container {
                    width: 50vw;
                    min-width: 700px;
                    max-height: 90vh;
                    background-color: ${theme.highContrastDark}ee;
                    margin: 5vh 5vw;
                    padding: 2em;
                    border-radius: 4px;
                    backdrop-filter: blur(3px);
                    box-shadow: 0 0 50px 5px #00000080;
                }
                
                .page-container {
                    
                }
                
                .close {
                    cursor: pointer;
                    position: absolute;
                    top: 1em;
                    right: 1em;
                }
            `}
        </style>
    </div>;
}

export default BuildPage;