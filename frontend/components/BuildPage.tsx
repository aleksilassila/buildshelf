import { Build } from "../interfaces/ApiResponses";
import ImageCollection from "./ImageCollection";
import Separator from "./utils/Separator";
import * as MultipleButton from "./ui/MultipleButton";
import axios from "axios";
import { useEffect, useState } from "react";
import Auth from "../utils/auth";
import Heart from "./icons/Heart";
import Button from "./ui/Button";
import Link from "next/link";
import Loading from "./statuses/Loading";
import NetworkError from "./statuses/NetworkError";
import { useApi } from "../utils/api";
import theme from "../constants/theme";
import minecraftDataVersions from "../constants/minecraftDataVersions";
import Markdown from "./Markdown";
import ExternalLink from "./icons/ExternalLink";
import CloseIcon from "./icons/CloseIcon";
import BuildTitle from "./buildPage/BuildTitle";

interface Props {
  buildId: number | string;
}

interface FloatingProps extends Props {
  setBuildPage: (number) => void;
}

const Static = ({ ...rest }: Props) => (
  <div className="page-container">
    <BuildPage {...rest} />
  </div>
);

const Floating = ({ buildId, setBuildPage, ...rest }: FloatingProps) => (
  <div
    className="fixed top-0 left-0 z-50 bg-[#00000022] w-screen h-screen md:p-4 lg:p-8 xl:p-12"
    style={{ display: buildId === undefined ? "none" : "block" }}
    onClick={(e) => e.target === e.currentTarget && setBuildPage(undefined)}
  >
    <div className="bg-white w-full h-full flex flex-col md:rounded-xl">
      <div className="flex flex-row items-center justify-end text-stone-500 gap-3 p-2 px-4">
        <a href={"/build/" + buildId} className="flex items-center">
          <ExternalLink className="w-6 h-6" />
        </a>
        <CloseIcon
          className="cursor-pointer w-6 h-6"
          onClick={() => setBuildPage(undefined)}
        />
      </div>
      <div className="flex-auto overflow-y-scroll p-8 pt-0">
        <BuildPage buildId={buildId} {...rest} />
      </div>
    </div>
  </div>
);

const BuildPage = ({ buildId }: Props) => {
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <NetworkError />;
  }
  const mdv = build?.buildFile?.minecraftDataVersion;
  const minecraftDataVersionString =
    mdv in minecraftDataVersions ? "(" + minecraftDataVersions[mdv] + ")" : "";

  return (
    <div>
      <div className="flex flex-row justify-between">
        <BuildTitle build={build} />

        <div className="build-actions">
          {userObject?.uuid === build.creator.uuid ? (
            <Link href={"/build/" + build.id + "/edit"}>
              <Button onClick={() => {}} mode="primary">
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
      {build.images?.length ? Separator : null}
      {build.images?.length ? <ImageCollection images={build.images} /> : null}
      {Separator}
      <div className="build-info">
        <div className="build-description markdown">
          <Markdown>{build.description}</Markdown>
        </div>
        <div className="info-separator">{Separator}</div>
        <div className="build-details">
          <h3 className="margin-bottom">Build Details</h3>
          <div>Total saves: {build.totalSaves}</div>
          <div>Block count: {build?.buildFile?.blockCount}</div>
          <div>
            Build dimensions: {build?.buildFile?.x}x{build?.buildFile?.y}x
            {build?.buildFile?.z}
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
    </div>
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

  return (
    <MultipleButton.Root>
      <MultipleButton.Button
        mode={sbData.isBuildSaved ? "primary" : "label"}
        className={"cursor-default"}
      >
        <span className="font-semibold">
          <Heart /> {sbData.saveCount}
        </span>
      </MultipleButton.Button>
      <MultipleButton.Button onClick={saveBuild}>
        {sbData.isBuildSaved ? "Unsave build" : "Save build"}
      </MultipleButton.Button>
    </MultipleButton.Root>
  );
};

export { Static, Floating };
