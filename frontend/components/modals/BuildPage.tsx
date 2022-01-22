import { Build } from "../../interfaces/ApiResponses";
import ImageCollection from "../ImageCollection";
import Separator from "../utils/Separator";
import MultipleButton, { MultipleButtonData } from "../common/MultipleButton";
import axios from "axios";
import { useEffect, useState } from "react";
import Auth from "../../utils/auth";
import ModalContainer from "../../containers/ModalContainer";
import Heart from "../icons/Heart";
import Button from "../common/Button";
import Link from "next/link";
import Loading from "../statuses/Loading";
import NetworkError from "../statuses/NetworkError";
import { useApi } from "../hooks/api";
import TitleSubtitlePicture from "../TitleSubtitlePicture";
import ReactMarkdown from "react-markdown";

interface Props {
  buildId: number | string;
  setBuildPage: (number) => void;
  modal: boolean;
}

const BuildPage = ({ buildId, setBuildPage, modal = true }: Props) => {
  if (buildId === undefined) return null;

  const [build, loading, error] = useApi<Build>("/build/" + buildId, {}, [
    buildId,
  ]);

  const [FBData, setFBData] = useState({
    active: true,
    isBuildFavorite: false,
    favoriteCount: 0,
  });

  useEffect(() => {
    if (loading || error) return;
    setFBData({
      favoriteCount: build.totalFavorites,
      active: false,
      isBuildFavorite: build.isFavorite,
    });
  }, [build]);

  const userObject = Auth.getUser();

  const close = () => setBuildPage(undefined);

  const Container = ({ children }) => {
    if (modal) {
      return (
        <ModalContainer externalUrl={"/build/" + buildId} close={close}>
          {children}
        </ModalContainer>
      );
    } else {
      return <div className="medium-page-container">{children}</div>;
    }
  };

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <NetworkError />
      </Container>
    );
  }

  return (
    <Container>
      <div className="build-title">
        <TitleSubtitlePicture
          title={build.title}
          subtitle={
            <span>
              Litematic by{" "}
              <a href={"/user/" + build.creator?.uuid} className="username">
                {build.creator?.username}
              </a>
            </span>
          }
          picture={
            <img
              src={
                build.creator &&
                "https://crafatar.com/avatars/" + build.creator.uuid
              }
              alt={build.creator?.username}
              className="profile-picture"
            />
          }
        />
        <div className="build-actions">
          {userObject?.uuid === build.creator.uuid ? (
            <Link href={"/build/" + build.id + "/edit"}>
              <Button primary onClick={() => {}}>
                Edit Build
              </Button>
            </Link>
          ) : userObject ? (
            <FavoriteButton
              buildId={buildId}
              fbData={FBData}
              setFBData={setFBData}
            />
          ) : null}
        </div>
      </div>
      {Separator}
      <ImageCollection images={build.images} />
      {Separator}
      <div className="build-details">
        <div className="build-description markdown">
          <ReactMarkdown>{build.description}</ReactMarkdown>
        </div>
        <div className="build-info">
          <span>{new Date(build.createdAt).toDateString()}</span>
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

          .build-actions {
            display: flex;
            flex-direction: column;
            align-items: end;
            justify-content: end;
          }

          .build-actions > :global(*) {
            //flex: 1 0 auto;
          }

          .build-actions > :global(*:not(:last-child)) {
            margin-bottom: 0.5em;
          }

          .build-details {
            display: grid;
            grid-template-columns: 2fr 1fr;
            //display: flex;
            //flex-direction: row;
            //flex-wrap: wrap;
            //justify-content: space-between;
          }
          
          .build-description {
            min-width: 300px;
            max-width: 600px;
            flex: 1 1 0;
            margin: 0 1em;
          }
          
          .build-info {
          
          }
        `}
      </style>
    </Container>
  );
};

const FavoriteButton = ({ buildId, fbData, setFBData }) => {
  const userObject = Auth.getUser();

  const addToFavorites = () => {
    if (fbData.active) return;

    setFBData({ active: true, ...fbData });

    axios
      .post(
        process.env.BACKEND_ENDPOINT + `/build/${buildId}/favorite`,
        {
          favorite: !fbData.isBuildFavorite,
        },
        { params: { token: userObject.token } }
      )
      .then((res) => {
        const newFavoriteCount =
          fbData.favoriteCount + (!fbData.isBuildFavorite ? 1 : -1);

        setFBData({
          active: false,
          isBuildFavorite:
            res.status === 200
              ? !fbData.isBuildFavorite
              : fbData.isBuildFavorite,
          favoriteCount:
            res.status === 200 ? newFavoriteCount : fbData.favoriteCount,
        });
      })
      .catch((err) => setFBData({ active: false, ...fbData }));
  };

  const favoriteButtonData: MultipleButtonData[] = [
    {
      content: (
        <span style={{ fontWeight: 600 }}>
          <Heart /> {fbData.favoriteCount}
        </span>
      ),
      unclickable: true,
      active: fbData.isBuildFavorite,
    },
    {
      content: (
        <span onClick={addToFavorites}>
          {fbData.isBuildFavorite
            ? "Remove from favorites"
            : "Add to favorites"}
        </span>
      ),
      active: fbData.active,
    },
  ];

  return <MultipleButton data={favoriteButtonData} />;
};

export default BuildPage;
