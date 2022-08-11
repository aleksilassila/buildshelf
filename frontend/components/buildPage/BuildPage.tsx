import { Build } from "../../interfaces/ApiResponses";
import ImageCollection from "../ImageCollection";
import Separator from "../utils/Separator";
import * as MultipleButton from "../ui/MultipleButton";
import { useEffect, useState } from "react";
import Heart from "../icons/Heart";
import PrimaryButton from "../ui/button/Button";
import Link from "next/link";
import Loading from "../statuses/Loading";
import NetworkError from "../statuses/NetworkError";
import { apiRequest, useApi } from "../../utils/api";
import theme from "../../constants/theme";
import minecraftDataVersions from "../../constants/minecraftDataVersions";
import Markdown from "../Markdown";
import ExternalLink from "../icons/ExternalLink";
import CloseIcon from "../icons/CloseIcon";
import BuildTitle from "./BuildTitle";
import { useLocalUser } from "../../utils/auth";
import IconButton from "../ui/button/IconButton";
import { DivComponent } from "../../interfaces/Props";
import AwesomeIcon from "../icons/AwesomeIcon";

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
      <div className="flex flex-row items-center justify-end text-stone-500 gap-2 p-2 px-2">
        <a href={"/builds/" + buildId} className="flex items-center">
          <AwesomeIcon icon="faArrowUpRightFromSquare" className="w-6 h-6" />
        </a>
        <AwesomeIcon
          icon={"faXmark"}
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

  const localUser = useLocalUser();
  const [build, loading, error] = useApi<Build>("/builds/" + buildId, {}, [
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <NetworkError />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1">
        <BuildTitle build={build} />

        <div className="flex flex-row gap-2 self-end md:justify-self-end justify-self-start">
          <Link
            href={
              process.env.BACKEND_ENDPOINT + "/builds/" + build.id + "/download"
            }
          >
            <IconButton icon="faFileArrowDown" />
          </Link>
          {localUser?.uuid === build.creator.uuid ? (
            <Link href={"/builds/" + build.id + "/edit"}>
              <PrimaryButton mode="primary">Edit Build</PrimaryButton>
            </Link>
          ) : localUser.isLoggedIn() ? (
            <SaveButton
              buildId={buildId}
              sbData={SBData}
              setSBData={setSBData}
            />
          ) : null}
        </div>
      </div>
      <Separator />
      <div
        className={"grid grid-cols-1 gap-x-8 md:grid-cols-[1fr_max_content]"}
      >
        {build.images?.length ? (
          <>
            <ImageCollection
              images={build.images}
              className={"col-span-1 md:col-span-2"}
            />
            <Separator className={"col-span-1 md:col-span-2"} />
          </>
        ) : null}

        <Markdown
          className={`p-4 overflow-x-scroll max-w-2xl w-full ${theme.ui.borders}`}
        >
          {build.description}
        </Markdown>
        <Separator className="md:hidden" />
        <BuildDetails build={build} className="md:justify-self-end" />
      </div>
    </div>
  );
};

const SaveButton = ({ buildId, sbData, setSBData }) => {
  const saveBuild = () => {
    if (sbData.active) return;

    setSBData({ active: true, ...sbData });

    apiRequest({
      method: "POST",
      url: "/builds/" + buildId + "/save",
      data: {
        save: !sbData.isBuildSaved,
      },
    })
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

const BuildDetails = ({
  build,
  className,
}: { build: Build } & DivComponent) => {
  const mdv = build?.buildFile?.minecraftDataVersion;
  const minecraftDataVersionString =
    mdv in minecraftDataVersions ? "(" + minecraftDataVersions[mdv] + ")" : "";

  return (
    <div className={`text-stone-600 font-medium ${className}`}>
      <h3 className="pb-2 mb-2 font-semibold border-b border-stone-200">
        Build Details
      </h3>
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
  );
};

export { Static, Floating };
