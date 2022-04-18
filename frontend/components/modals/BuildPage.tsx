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
import { useApi } from "../../utils/api";
import TitleSubtitlePicture from "../TitleSubtitlePicture";
import ReactMarkdown from "react-markdown";
import theme from "../../constants/theme";
import minecraftDataVersions from "../../constants/minecraftDataVersions";

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

  const [SBData, setSBData] = useState({
    active: true,
    isBuildSaved: false,
    saveCount: 0,
  });

  useEffect(() => {
    if (loading || error) return;
    setSBData({
      active: false,
      saveCount: build.totalSaves,
      isBuildSaved: build.isSaved,
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
  const mdv = build?.buildFile?.minecraftDataVersion;
  const minecraftDataVersionString =
    mdv in minecraftDataVersions ? "(" + minecraftDataVersions[mdv] + ")" : "";

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
            <SaveButton
              buildId={buildId}
              sbData={SBData}
              setSBData={setSBData}
            />
          ) : null}
        </div>
      </div>
      {Separator}
      <ImageCollection images={build.images} />
      {Separator}
      <div className="build-info">
        <div className="build-description markdown">
          <ReactMarkdown>{build.description}</ReactMarkdown>
        </div>
        <div className="info-separator">{Separator}</div>
        <div className="build-details">
          <h3 className="margin-bottom">Build Details</h3>
          <div>Total saves: {build.totalSaves}</div>
          <div>Block count: {build?.buildFile?.blockCount}</div>
          <div>
            Build dimensions: {build?.buildFile?.enclosingSize?.x}x
            {build?.buildFile?.enclosingSize?.y}x
            {build?.buildFile?.enclosingSize?.z}
          </div>
          <div>Litematic version: {build?.buildFile?.version}</div>
          <div>
            Minecraft data version: {build?.buildFile?.minecraftDataVersion}{" "}
            {minecraftDataVersionString}
          </div>
          <div>Created: {new Date(build?.createdAt).toDateString()}</div>
          <div>Updated: {new Date(build?.updatedAt).toDateString()}</div>
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

          .build-info {
            display: flex;
            flex-wrap: wrap;
            //display: flex;
            //flex-direction: row;
            //flex-wrap: wrap;
            //justify-content: space-between;
          }

          .build-description {
            min-width: 450px;
            max-width: 600px;
            flex: 2 2 0;
            margin: 0 1em;
          }

          .build-details {
            flex: 1 1 0;
            border: 1px solid ${theme.lightLowContrast};
            background-color: ${theme.lightHighContrast};
            padding: 1em;
            border-radius: 4px;
            height: fit-content;
            min-width: 300px;
          }

          .build-details > div {
            color: ${theme.darkLowContrast};
            font-weight: 500;
          }

          .info-separator {
            display: none;
          }
          
          @media screen and (max-width: 750px) {  
            .build-info {
              flex-direction: column;
            }
            
            .build-info > * {
              min-width: 0;
            }
            
            .info-separator {
              display: block;
            }
          }
        `}
      </style>
    </Container>
  );
};

const SaveButton = ({ buildId, sbData, setSBData }) => {
  const userObject = Auth.getUser();

  const saveBuild = () => {
    if (sbData.active) return;

    setSBData({ active: true, ...sbData });

    axios
      .post(
        process.env.BACKEND_ENDPOINT + `/build/${buildId}/save`,
        {
          save: !sbData.isBuildSaved,
        },
        { params: { token: userObject.token } }
      )
      .then((res) => {
        const newSaveCount = sbData.saveCount + (!sbData.isBuildSaved ? 1 : -1);

        setSBData({
          active: false,
          isBuildSaved:
            res.status === 200 ? !sbData.isBuildSaved : sbData.isBuildSaved,
          saveCount: res.status === 200 ? newSaveCount : sbData.saveCount,
        });
      })
      .catch((err) => setSBData({ active: false, ...sbData }));
  };

  const saveButtonData: MultipleButtonData[] = [
    {
      content: (
        <span style={{ fontWeight: 600 }}>
          <Heart /> {sbData.saveCount}
        </span>
      ),
      unclickable: true,
      active: sbData.isBuildSaved,
    },
    {
      content: (
        <span onClick={saveBuild}>
          {sbData.isBuildSaved ? "Unsave build" : "Save build"}
        </span>
      ),
      active: sbData.active,
    },
  ];

  return <MultipleButton data={saveButtonData} />;
};

export default BuildPage;
