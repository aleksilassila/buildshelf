import Link from "next/link";
import TitleBar from "../components/TitleBar";
import CardsRowView from "../containers/CardsRowView";
import { useEffect, useState } from "react";
import axios from "axios";
import messages from "../constants/messages";
import CardsGridView from "../containers/CardsGridView";
import Auth from "../utils/auth";
import theme from "../constants/theme";

const Home = () => {
  const [topData, setTopData] = useState(null);
  const [newData, setNewData] = useState(null);
  const [followedData, setFollowedData] = useState(null);

  const userObject = Auth.getUser();

  useEffect(() => {
    if (userObject === undefined) return;

    axios
      .get(process.env.BACKEND_ENDPOINT + "/builds/get?sort=top&")
      .then((res) => setTopData(res.data || []))
      .catch((err) => {});

    axios
      .get(process.env.BACKEND_ENDPOINT + "/builds/get?sort=new&")
      .then((res) => setNewData(res.data || []))
      .catch((err) => {});

    if (userObject?.token) {
      axios
        .get(process.env.BACKEND_ENDPOINT + "/builds/get/followed", {
          params: {
            token: userObject.token,
          },
        })
        .then((res) => setFollowedData(res.data || []))
        .catch((err) => {});
    }
  }, []);

  /*
   * TODO:
   *  - Browse and favorite collections
   *  - Finish builds page filters, search and cards design
   *  - Redesign frontpage?
   *  - Finish dropdowns
   *  - Improve buttons and create multiplebutton variation
   *  - Improve title bar
   *    - Dropdown with logout and more links there
   *  - Administration tools
   *  - General styling changes
   *    - Boring gray
   *  - Api documentation
   *  - Api proper error handling
   *  - Infinite scroll
   *  - Update card row behavior
   *  - New dedicated search page?
   *  - ICONS
   *  - EDIT BUILDS
   * */

  const BuildsRowHeading = ({ text }) => {
    return (
      <div className="container">
        <h3>{text}</h3>
        <Link href="/builds">
          <a>Show All</a>
        </Link>
        <style jsx>{`
          .container {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }

          a {
            font-size: 0.9em;
          }

          a:visited {
            color: unset;
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="background">
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
        <CardsRowView
          builds={topData || []}
          heading={
            <BuildsRowHeading
              text={!!topData ? "Popular builds right now" : messages.loading}
            />
          }
        />
        <CardsRowView
          builds={newData || []}
          heading={
            <BuildsRowHeading
              text={!!newData ? "New builds" : messages.loading}
            />
          }
        />
        <div className="follows-grid">
          <CardsGridView
            heading={
              <h2>{!!followedData ? "Followed creators" : messages.loading}</h2>
            }
            builds={followedData || []}
          />
        </div>
      </div>
      <style jsx>{`
        .background {
          min-height: 100vh;
          width: 100vw;
        }

        .introduction {
          margin: 6em 5vw;
        }

        .follows-grid {
          padding: 3vh 3vw;
        }
      `}</style>
    </div>
  );
};

export default Home;
