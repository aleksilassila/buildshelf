import Link from "next/link";
import TitleBar from "../components/bars/TitleBar";
import CardsRowView from "../containers/CardsRowView";
import messages from "../constants/messages";
import CardsGridView from "../containers/CardsGridView";
import Auth from "../utils/auth";
import theme from "../constants/theme";
import { useApi } from "../components/hooks/api";
import { Build } from "../interfaces/ApiResponses";

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
   *  - Edit and manage own builds
   *    - Markdown
   *  - Sync files
   *    - Favorites -> Syncs?
   *  - Favorite collections
   *  - Browse creators
   *  - Finish builds page filters, search
   *  - Markdown in build description
   *  - Finish dropdowns?
   *  - Improve buttons and create multiplebutton variation
   *  - Improve title bar
   *    - Dropdown with logout and more links there
   *  - Administration tools
   *  - Api documentation
   *  - Infinite scroll
   *  - Update card row behavior?
   *  - New dedicated search page?
   * */

  return (
    <div className="home">
      <TitleBar active="home" />
      <div className="introduction">
        <h2>The most ambitious Minecraft build library at your hands</h2>
        <p>
          Litematica Library is a place to store, share and browse all kinds on
          Minecraft builds and projects. You can download Litematica mod{" "}
          <a href="https://www.curseforge.com/minecraft/mc-mods/litematica">
            here
          </a>
          .
        </p>
      </div>
      <div className="content">
        <div className="page-container">
          <CardsRowView builds={topData || []}>
            <Link href="/builds">
              <h2 className="row-heading-link">
                {!!topData ? "Popular builds right now" : messages.loading}
              </h2>
            </Link>
          </CardsRowView>
        </div>
        <div className="page-container">
          <CardsRowView builds={newData || []}>
            <Link href="/builds">
              <h2 className="row-heading-link">
                {!!newData ? "New builds" : messages.loading}
              </h2>
            </Link>
          </CardsRowView>
        </div>
        <div className="page-container">
          <CardsGridView
            builds={followedData || []}
            error={followedError}
            loading={followedLoading}
          >
            <h2>{!!followedData ? "Followed creators" : messages.loading}</h2>
          </CardsGridView>
        </div>
      </div>
      <style jsx>{`
        .home {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .introduction {
          margin: 6em 5vw;
        }

        .content {
          background-color: ${theme.light}; //hsl(147deg 21% 95%)
        }

        .row-heading-link:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Home;
