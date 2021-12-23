import { Build } from "../../interfaces/Builds";
import CloseIcon from "../icons/CloseIcon";
import theme from "../../constants/theme";
import messages from "../../constants/messages";
import ImageCollection from "../ImageCollection";
import Separator from "../icons/Separator";
import SplashText from "../statuses/SplashText";
import ErrorText from "../statuses/ErrorText";
import MultipleButton, { MultipleButtonData } from "../common/MultipleButton";
import axios from "axios";
import { useEffect, useState } from "react";
import Auth from "../../utils/auth";

interface Props {
  buildId: number;
  setBuildPage: (number) => void;
  modal: boolean;
}

const Container = ({ children, close, splash = false }) => (
  <div className="container" onClick={close}>
    <div className="content" onClick={(e) => e.stopPropagation()}>
      {/*<div className="close"><Button onClick={close}>Back</Button></div>*/}
      {children}
      <div className="close">
        <CloseIcon close={close} />
      </div>
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
          overflow: scroll;
          ${splash &&
          `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              `}
        }

        .close {
          cursor: pointer;
          position: absolute;
          top: 0.2em;
          right: 0.2em;
        }
      `}
    </style>
  </div>
);

const BuildPage = ({ buildId, setBuildPage }: Props) => {
  if (buildId === undefined) return null;

  const [favoriteButton, setFavoriteButton] = useState({
    active: true,
    isBuildFavorite: false,
    favoriteCount: 0,
  });

  const userObject = Auth.getUser();

  const [data, setData] = useState<Build>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userObject === undefined || error || data) return;

    console.log("Fetching build page...");

    axios
      .get<Build>(process.env.BACKEND_ENDPOINT + `/build/${buildId}`, {
        params: {
          token: userObject.token,
        },
      })
      .then((res) => {
        setData(res.data);
        console.log(res.data.isFavorite);
        setFavoriteButton({
          favoriteCount: res.data.totalFavorites,
          active: false,
          isBuildFavorite: res.data.isFavorite,
        });
      })
      .catch(setError);
  }, [userObject]);

  const close = () => setBuildPage(undefined);

  if (!data) {
    return (
      <Container close={close} splash>
        <SplashText>
          <h2>{messages.loading}</h2>
        </SplashText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container close={close} splash>
        <ErrorText>
          <h2>{messages.errorTitle}</h2>
          <p>{messages.errorFetch("the build")}</p>
        </ErrorText>
      </Container>
    );
  }

  const addToFavorites = () => {
    if (favoriteButton.active) return;
    setFavoriteButton({ active: true, ...favoriteButton });

    axios
      .post(
        process.env.BACKEND_ENDPOINT + `/build/${buildId}/favorite`,
        {
          favorite: !favoriteButton.isBuildFavorite,
        },
        { params: { token: userObject.token } }
      )
      .then((res) => {
        const newFavoriteCount =
          favoriteButton.favoriteCount +
          (!favoriteButton.isBuildFavorite ? 1 : -1);

        setFavoriteButton({
          active: false,
          isBuildFavorite:
            res.status === 200
              ? !favoriteButton.isBuildFavorite
              : favoriteButton.isBuildFavorite,
          favoriteCount:
            res.status === 200
              ? newFavoriteCount
              : favoriteButton.favoriteCount,
        });
      })
      .catch((err) => setFavoriteButton({ active: false, ...favoriteButton }));
  };

  const favoriteButtonData: MultipleButtonData[] = [
    {
      content: <span>{favoriteButton.favoriteCount}</span>,
      unclickable: true,
      active: favoriteButton.isBuildFavorite,
    },
    {
      content: (
        <span onClick={addToFavorites}>
          {favoriteButton.isBuildFavorite
            ? "Remove from favorites"
            : "Add to favorites"}
        </span>
      ),
      active: favoriteButton.active,
    },
  ];

  return (
    <Container close={close}>
      <div className="build-title">
        <div className="creator-profile">
          <img
            src={"https://crafatar.com/avatars/" + data.creator.uuid}
            alt=""
            className="profile-picture"
          />
          <div className="creator-profile-content">
            <h2>{data.title}</h2>
            <span>
              By{" "}
              <a href={"/user/" + data.creator.uuid} className="username">
                {data.creator.username}
              </a>
            </span>
          </div>
        </div>
        <div className="build-stats">
          <MultipleButton data={favoriteButtonData} />
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
            justify-content: space-between;
          }

          .profile-picture {
            height: 4em;
            margin-right: 1em;
          }

          .creator-profile {
            display: flex;
            flex-direction: row;
          }

          .creator-profile-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .username {
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
          }

          .username:visited {
            color: inherit;
          }

          .build-stats {
            display: flex;
            flex-direction: column;
            align-items: end;
            justify-content: end;
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
    </Container>
  );
};

export default BuildPage;
