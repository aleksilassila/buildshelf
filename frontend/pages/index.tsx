import Link from "next/link";
import TitleBar from "../components/bars/TitleBar";
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
   *  - Edit and manage own builds
   *  - Browse and favorite collections
   *  - Browse and follow creators
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
        <CardsRowView builds={topData || []}>
          <Link href="/builds">
            <h2 className="row-heading-link">
              {!!topData ? "Popular builds right now" : messages.loading}
            </h2>
          </Link>
        </CardsRowView>
        <CardsRowView builds={newData || []}>
          <Link href="/builds">
            <h2 className="row-heading-link">
              {!!newData ? "New builds" : messages.loading}
            </h2>
          </Link>
        </CardsRowView>
        <div className="follows-grid">
          <CardsGridView builds={followedData || []}>
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

        .follows-grid {
          padding: 2rem 5vw;
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
