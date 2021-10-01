import theme from "../theme";
import Link from 'next/link';
import Auth from "../utils/auth";

const TitleBar = () => {
    const userObject = Auth.getUser();

    return (
        <div className="title-bar">
            <span className="title">Litematica Library</span>
            <ul>
                <Link href="/"><a>Home</a></Link>
                <Link href="/builds"><a>Browse Builds</a></Link>
                {userObject?.username ? <span>Logged in as {userObject.username}</span> : <Link href="/login"><a>Log In</a></Link>}
            </ul>
            <style jsx>{`
                .title-bar {
                    background-color: ${theme.darkPurple};
                    color: ${theme.text.light};
                    display: flex;
                    justify-content: space-between;
                    padding: 1.4em 1.2em;
                    color: ${theme.text.lightPurple}
                }
                
                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                
                ul a, ul span {
                    display: inline-block;
                    margin: 0 0.6em;
                    font-weight: 100;
                    text-transform: uppercase;
                    font-size: 0.8em;
                    color: inherit;
                    text-decoration: none;
                }
                
                ul a:hover {
                    cursor: pointer;
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}

export default TitleBar;
