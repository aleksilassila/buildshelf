import Link from "next/link";
import TitleBar from "../components/bars/TitleBar";
import CardsRowView from "../containers/CardsRowView";
import messages from "../constants/messages";
import CardsGridView from "../containers/CardsGridView";
import Auth from "../utils/auth";
import theme from "../constants/theme";
import { useApi } from "../utils/api";
import { Build } from "../interfaces/ApiResponses";
import Styled from "../components/Styled";

const Home = () => {
  const [topData, topLoading, topError] = useApi<Build[]>(
    "/builds/get?sort=top&",
    {},
    []
  );
  const [newData, newLoading, newError] = useApi<Build[]>(
    "/builds/get?sort=new&",
    {},
    []
  );
  const [followedData, followedLoading, followedError] = useApi<Build[]>(
    "/builds/get/followed",
    {},
    [],
    true
  );

  const userObject = Auth.getUser();

  /*
   * TODO:
   *  - Toast colors
   *  - Adjust image order
   *  - Working sort by popular
   *  - Typescript backend / nextjs
   *  - Implement private (paid) builds
   *  - Redesign front page
   *    - "Add litematica extension portion"
   *  - Manage and remove own builds
   *    - Markdown
   *  - Favorite collections
   *  - Browse creators
   *  - Fix multiplebutton
   *  - Administration tools
   *  - Api documentation
   *  - Update card row behavior?
   *  - New dedicated search page?
   * */

  const PageContainer = ({ children }) => (
    <div className="mb-16">{children}</div>
  );

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
      <div className="flex flex-col flex-1 mx-8">
        <div className="my-24 mx-auto max-w-5xl">
          <h2 className={theme.text.bold}>
            The most ambitious Minecraft build library at your hands
          </h2>
          <p className="tracking-wide">
            Buildshelf is a place to find, store and share all kinds of
            Minecraft builds and projects. This project mainly utilises a
            minecraft blueprinting mod called Litematica. You can download
            Litematica{" "}
            <a href="https://www.curseforge.com/minecraft/mc-mods/litematica">
              here
            </a>
            .
          </p>
        </div>
        <div className="">
          <PageContainer>
            <CardsRowView builds={topData || []}>
              <CategoryLink
                href="/builds"
                text={!!topData ? "Popular builds right now" : messages.loading}
              />
            </CardsRowView>
          </PageContainer>
          <PageContainer>
            <CardsRowView builds={newData || []}>
              <CategoryLink
                href="/builds"
                text={!!newData ? "New builds" : messages.loading}
              />
            </CardsRowView>
          </PageContainer>
          {followedData?.length !== 0 ? (
            <PageContainer>
              <CardsGridView
                builds={followedData || []}
                error={followedError}
                loading={followedLoading}
              >
                <h2 className="font-bold text-xl">
                  {followedData ? "Followed creators" : messages.loading}
                </h2>
              </CardsGridView>
            </PageContainer>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Home;
