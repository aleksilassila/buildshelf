import Link from "next/link";
import Navbar from "../components/navbar/Navbar";
import CardsRowView from "../containers/CardsRowView";
import messages from "../constants/messages";
import CardsGridView from "../containers/CardsGridView";
import { useApi } from "../utils/api";
import { Build } from "../interfaces/ApiResponses";
import styled from "../components/Styled";
import { ImageIcon } from "../components/icons/ImageIcon";
import { Anchor, Heading, Paragraph } from "../components/ui/CommonElements";

const Banner = ({ children, uri }) => (
  <div
    className="bg-cover h-[75vh] flex flex-col justify-center"
    style={{
      background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
              url("/mockImages/wheat.jpg") fixed no-repeat center center`,
      marginTop: "0",
      backgroundSize: "cover",
    }}
  >
    <div className="m-auto md:w-3/4 w-5/6 max-w-5xl text-center bg-stone-800 text-stone-300 p-8 md:px-16">
      {children}
    </div>
  </div>
);

const Padded = styled("px-8 xl:px-16 2xl:px-24");
const Green = (props) => (
  <span className="text-green-600 font-bold">{props.children}</span>
);

const Home = () => {
  const [popularData, popularLoading, popularError] = useApi<Build[]>(
    "/builds/search?sort=popular&private=false",
    {},
    []
  );
  const [newData, newLoading, newError] = useApi<Build[]>(
    "/builds/search?sort=new&private=false",
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
   *  - add faq
   *  - add mod info
   *  - Radix icons / more icons
   *  - Make frontpage banner change picture, get proper mock images
   *  - Favorite collections
   *  - Manage collections
   *  - Optimize photo sizes
   * TODO:
   *  - Editing removes old images
   *  - logging
   *  - Make error messages and loading screens consistent
   *  - Improve ui components
   *    - States inside components and callbacks
   *  - Form validation
   *  - Popular collection = best average score
   *  - More middleware to make code dry
   *  - Adjust image order
   *  - Administration tools
   *    - Ban uuids
   *  - Implement private (paid) builds
   *  - Browse creators
   *  - Api documentation
   *  - New dedicated search page?
   *  - Search and sort by date and time
   * */

  const CategoryLink = ({ href, children }) => (
    <Link href={href}>
      <h2 className="font-bold text-xl cursor-pointer hover:underline">
        {children}
      </h2>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar active="/" />
      <Banner uri={popularData?.[0]?.images?.[0]?.filename}>
        <h2 className={"md:text-2xl text-xl font-bold mb-2 text-stone-100"}>
          The open source community for Minecraft builds
        </h2>
        <p className="tracking-wide md:text-lg">
          Buildshelf is a place to find, store and share all kinds of Minecraft
          builds and projects. This project utilises a Minecraft blueprinting
          mod called Litematica. You can download Litematica{" "}
          <Anchor href="https://www.curseforge.com/minecraft/mc-mods/litematica">
            here
          </Anchor>
          .
        </p>
      </Banner>
      <Padded className="flex flex-col flex-1 text-lg py-32">
        <Heading>How does it work?</Heading>
        <ul className={"tracking-wide"}>
          <li>
            <Green>1.</Green> Log in with your Minecraft account
          </li>
          <li>
            <Green>2.</Green> Download{" "}
            <Anchor
              href={
                "https://www.curseforge.com/minecraft/mc-mods/buildshelf-sync"
              }
            >
              Litematica extension
            </Anchor>{" "}
            (fabric mod) to automatically sync your builds
          </li>
          <li>
            <Green>3.</Green> Browse and save builds in Buildshelf to
            automatically have them downloaded to your Minecraft client
          </li>
        </ul>
      </Padded>
      <Padded className={"flex flex-col gap-16"}>
        <CardsRowView builds={popularData || []}>
          <CategoryLink href="/builds">
            {!!popularData ? "Popular builds right now" : messages.loading}
          </CategoryLink>
        </CardsRowView>
        <CardsRowView builds={newData || []}>
          <CategoryLink href="/builds">
            {!!newData ? "New builds" : messages.loading}
          </CategoryLink>
        </CardsRowView>
        {!!followedData?.length ? (
          <CardsGridView
            builds={followedData || []}
            error={followedError}
            loading={followedLoading}
          >
            <h2 className="font-bold text-xl mb-2">
              {followedData ? "Followed creators" : messages.loading}
            </h2>
          </CardsGridView>
        ) : null}
      </Padded>
      <Padded className="py-32">
        <Heading>About the project</Heading>
        <Paragraph>
          This project is currently under development. If you want to track the
          progress or report a bug, you can do so in the project{" "}
          <Anchor href="https://github.com/aleksilassila/buildshelf">
            Github page
          </Anchor>
          .
        </Paragraph>
      </Padded>
      <Padded className={"text-stone-500 text-sm py-8 text-center"}>
        <div className="flex justify-between">
          <span>Copyright © 2022 buildshelf.net. All rights reserved.</span>
          <span>
            <a
              className="underline flex items-center"
              href="https://github.com/aleksilassila/buildshelf"
            >
              <ImageIcon src="/github.svg" className="opacity-70" />
              Source
            </a>
          </span>
        </div>
      </Padded>
    </div>
  );
};

export default Home;
