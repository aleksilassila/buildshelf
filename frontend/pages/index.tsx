import Link from "next/link";
import TitleBar from "../components/bars/TitleBar";
import CardsRowView from "../containers/CardsRowView";
import messages from "../constants/messages";
import CardsGridView from "../containers/CardsGridView";
import theme from "../constants/theme";
import { useApi } from "../utils/api";
import { Build } from "../interfaces/ApiResponses";
import styled from "../components/Styled";

const Banner = ({ children, uri }) => (
  <div
    className="bg-cover h-[75vh] flex flex-col justify-center"
    style={{
      background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
              url(${
                process.env.BACKEND_ENDPOINT + "/files/" + uri
              }) fixed no-repeat center center`,
      marginTop: "0",
    }}
  >
    <div className="m-auto w-3/4 max-w-5xl text-center bg-stone-800 text-stone-300 p-8 px-16">
      {children}
    </div>
  </div>
);

const Padded = styled("px-8 xl:px-16 2xl:px-24");

const Home = () => {
  const [popularData, popularLoading, popularError] = useApi<Build[]>(
    "/builds/search?sort=popular",
    {},
    []
  );
  const [newData, newLoading, newError] = useApi<Build[]>(
    "/builds/search?sort=new",
    {},
    []
  );
  const [followedData, followedLoading, followedError] = useApi<Build[]>(
    "/feed",
    {},
    [],
    true
  );

  /*
   * TODO before launch:
   *  - Radix icons / more icons
   *  - Make frontpage banner change picture, get proper mock images
   *  - Favorite collections
   *  - Manage collections
   * TODO:
   *  - Improve ui components
   *    - States inside components and callbacks
   *  - Form validation
   *  - Ban uuids
   *  - Popular collection = best average score
   *  - More middleware to make code dry
   *  - Make api endpoints consistent
   *  - Adjust image order
   *  - Administration tools
   *  - Implement private (paid) builds
   *  - Browse creators
   *  - Api documentation
   *  - New dedicated search page?
   *  - Search and sort by date and time
   *  - Fix multiplebutton
   * */

  const CategoryLink = ({ href, text }) => (
    <Link href={href}>
      <h2 className="font-bold text-xl cursor-pointer hover:underline">
        {text}
      </h2>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <TitleBar active="home" />
      <Banner uri={popularData?.[0]?.images?.[0]?.filename}>
        <h2 className={theme.text.bold + " text-stone-100"}>
          The open source community for Minecraft builds
        </h2>
        <p className="tracking-wide text-lg">
          Buildshelf is a place to find, store and share all kinds of Minecraft
          builds and projects. This project mainly utilises a minecraft
          blueprinting mod called Litematica. You can download Litematica{" "}
          <a
            href="https://www.curseforge.com/minecraft/mc-mods/litematica"
            className={theme.text.linkDark}
          >
            here
          </a>
          .
        </p>
      </Banner>
      <Padded className="flex flex-col flex-1 py-32 text-lg">
        <h2 className={theme.text.bold + " text-stone-800"}>
          How does it work?
        </h2>
        <ul className={"tracking-wide"}>
          <li>
            <span className={"text-green-600 font-bold"}>1.</span> Log in with
            your Minecraft account
          </li>
          <li>
            <span className={"text-green-600 font-bold"}>2.</span> Download{" "}
            <a href={""} className={theme.text.link}>
              Buildshelf extension
            </a>{" "}
            for Litematica to automatically sync your builds
          </li>
          <li>
            <span className={"text-green-600 font-bold"}>3.</span> Browse and
            save builds in Buildshelf to automatically have them synced to your
            minecraft client
          </li>
        </ul>
      </Padded>
      <Padded className={"flex flex-col gap-16"}>
        <CardsRowView builds={popularData || []}>
          <CategoryLink
            href="/builds"
            text={!!popularData ? "Popular builds right now" : messages.loading}
          />
        </CardsRowView>
        <CardsRowView builds={newData || []}>
          <CategoryLink
            href="/builds"
            text={!!newData ? "New builds" : messages.loading}
          />
        </CardsRowView>
        {followedData?.length !== 0 ? (
          <CardsGridView
            builds={followedData || []}
            error={followedError}
            loading={followedLoading}
          >
            <h2 className="font-bold text-xl">
              {followedData ? "Followed creators" : messages.loading}
            </h2>
          </CardsGridView>
        ) : null}
      </Padded>
      <Padded className={"text-stone-500 text-sm py-8 text-center"}>
        Copyright © 2022 Aleksi Lassila. All rights reserved.
      </Padded>
    </div>
  );
};

export default Home;
