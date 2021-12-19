import Link from 'next/link';
import TitleBar from "../components/TitleBar";
import CardsRowView from "../containers/CardsRowView";
import {useEffect, useState} from "react";
import axios from "axios";
import messages from "../constants/messages";

const Home = () => {
    const [topData, setTopData] = useState(null);
    const [newData, setNewData] = useState(null);

    useEffect(() => {
        console.log("Fetching builds...");

        axios.get(process.env.BACKEND_ENDPOINT + "/builds/get?sort=top&")
            .then(res => setTopData(res.data || []))
            .catch(err => {});

        axios.get(process.env.BACKEND_ENDPOINT + "/builds/get?sort=new&")
            .then(res => setNewData(res.data || []))
            .catch(err => {});
    }, []);

    /*
    * TODO: follow people and have their new builds show here,
    *  also favorite collections.
    * */

    const BuildsRowHeading = ({ text }) => {
        return <div className="container">
            <h3>{text}</h3>
            <Link href="/builds"><a>Show All</a></Link>
            <style jsx>{`
                h3 {
                    font-size: 1.4em;
                }
                
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
    }

    return (
        <div className={'background'}>
            <TitleBar active="home" />
            <div className="introduction">
                <h2 className="introduction-header">The most ambitious Minecraft build library at your hands</h2>
                <span className="introduction-paragraph">
                    Litematica Library is a place to store,{" "}
                    share and browse all kinds on Minecraft builds and projects.
                    You can download Litematica mod{" "}
                    <a href="https://www.curseforge.com/minecraft/mc-mods/litematica">here</a>.
                </span>
            </div>
            <CardsRowView builds={topData || []} heading={
                <BuildsRowHeading text={!!topData ? "Popular builds right now" : messages.loading} />
            }/>
            <CardsRowView builds={newData || []} heading={
                <BuildsRowHeading text={!!topData ? "New builds" : messages.loading} />
            }/>
            <style jsx>{`
                .background {
                    min-height: 100vh;
                    width: 100vw;
                }
                
                .banner span {
                    font-size: 0.9em;
                }
                
                .introduction {
                    margin: 6em 5vw;
                }
                
                .introduction-header {
                    margin-bottom: 0.2em;
                }
                
                .introduction-paragraph {
                    line-height: 1.3em;
                }
            `}</style>
        </div>
    );
};

export default Home;
