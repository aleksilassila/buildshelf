import useAxios from "axios-hooks";
import {Build} from "../../interfaces/Builds";
import CloseIcon from "../icons/CloseIcon";
import theme from "../../constants/theme";
import messages from "../../constants/messages";
import ImageCollection from "../ImageCollection";
import Separator from "../icons/Separator";
import SplashText from "../statuses/SplashText";
import ErrorText from "../statuses/ErrorText";

interface Props {
    buildId: number,
    setBuildPage: (number) => void,
    modal: boolean,
}

const Container = ({ children, close, splash = false }) => <div className="container">
    <div className="content">
        {children}
        <div className="close"><CloseIcon close={close} /></div>
    </div>
    <style jsx>
        {`
            .container {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 1;
                height: 100vh;
                width: 100vw;
                background-color: #00000080;
            }
            
            .content {
              height: calc(100vh - 3em);
              width: calc(100vw - 3em);
              background-color: ${theme.highContrastLight}dd;
              margin: 1.5em;
              padding: 2em;
              border-radius: 4px;
              backdrop-filter: blur(3px);
              ${splash && `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              `}
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

const BuildPage = ({ buildId, setBuildPage }: Props) => {
    if (buildId === undefined) return null;

    const [{ data, loading, error }, refetch] = useAxios<Build>(process.env.BACKEND_ENDPOINT + `/build/${buildId}`);

    const close = () => setBuildPage(undefined);

    if (loading) {
        return <Container close={close} splash>
            <SplashText>
                <h2>{messages.loading}</h2>
            </SplashText>
        </Container>
    }

    if (error) {
        return <Container close={close} splash>
            <ErrorText>
                <h2>{messages.errorTitle}</h2>
                <p>{messages.errorFetch("the build")}</p>
            </ErrorText>
        </Container>
    }

    return <Container close={close}>
        <div className="build-title">
            <img src={"https://crafatar.com/avatars/" + data.creator.uuid} alt="" className="profile-picture"/>
            <div className="build-title-content">
                <h2>{data.title}</h2>
                <span>By <a href={"/user/" + data.creator.uuid} className="username">{data.creator.username}</a></span>
            </div>
        </div>
        {Separator}
        <ImageCollection images={data.images} />
        {Separator}
        <div className="build-details">
            <span>{data.description}</span>
            <div>
                <span>{new Date(data.uploadedAt).toDateString()}</span>
            </div>
        </div>
        <style jsx>
            {`
                .build-title {
                  display: flex;
                  flex-direction: row;
                }
                
                .profile-picture {
                  height: 4em;
                  margin-right: 1em;
                }
                
                .build-title-content {
                  display: flex;
                  flex-direction: column;
                  
                }
                .username {
                  font-weight: 600;
                  cursor: pointer;
                  text-decoration: none;
                }
                
                .username:visited {
                  color: inherit;
                }
                
                
                
                .build-details {
                  display: flex;
                  flex-direction: row;
                  flex-wrap: wrap;
                }
                
                .build-details > * {
                  min-width: 230px;
                  flex: 1 1 0;
                  margin: 0 1em;
                }
            `}
        </style>
    </Container>;
}

export default BuildPage;