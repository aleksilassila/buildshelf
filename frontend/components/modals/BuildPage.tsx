import { Build } from "../../interfaces/Builds";
import messages from "../../constants/messages";
import ImageCollection from "../ImageCollection";
import Separator from "../icons/Separator";
import SplashText from "../statuses/SplashText";
import ErrorText from "../statuses/ErrorText";
import MultipleButton, { MultipleButtonData } from "../common/MultipleButton";
import axios from "axios";
import { useEffect, useState } from "react";
import Auth from "../../utils/auth";
import ModalContainer from "../../containers/ModalContainer";
import Heart from "../icons/Heart";

interface Props {
  buildId: number;
  setBuildPage: (number) => void;
  modal: boolean;
}

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
          token: userObject?.token,
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
      <ModalContainer close={close} splash>
        <SplashText>
          <h2>{messages.loading}</h2>
        </SplashText>
      </ModalContainer>
    );
  }

  if (error) {
    return (
      <ModalContainer close={close} splash>
        <ErrorText>
          <h2>{messages.errorTitle}</h2>
          <p>Could not fetch the build.</p>
        </ErrorText>
      </ModalContainer>
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
      content: (
        <span style={{ fontWeight: 600 }}>
          <Heart /> {favoriteButton.favoriteCount}
        </span>
      ),
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
    <ModalContainer close={close}>
      <div className="build-title">
        <div className="creator-profile">
          <img
            src={data.creator && ("https://crafatar.com/avatars/" + data.creator.uuid)}
            alt={data.creator?.username}
            className="profile-picture"
          />
          <div className="creator-profile-content">
            <h2>{data.title}</h2>
            <span>
              By{" "}
              <a href={"/user/" + data.creator?.uuid} className="username">
                {data.creator?.username}
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
          <span>{new Date(data.createdAt).toDateString()}</span>
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
    </ModalContainer>
  );
};

export default BuildPage;
