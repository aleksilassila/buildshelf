import theme from "../theme";
import Link from 'next/link';
import Auth from "../utils/auth";

const TitleBar = () => {
    const userObject = Auth.getUser();

    return <>
        <div className="title-bar">
            <h2 className="title">Litematica Library</h2>
            <ul>
                <Link href="/"><a>Home</a></Link>
                <Link href="/builds"><a>Builds</a></Link>
                <Link href="/about"><a>About</a></Link>
                {userObject?.username ? <Link href="/upload"><a>Upload</a></Link> : null}
                {userObject?.username ?
                    <Link href={"/user/" + userObject.id}><a>{userObject.username}</a></Link> :
                    <Link href="/login"><a>Log In</a></Link>}
            </ul>
        </div>
        <div className="separator" />
        <style jsx>{`
            .title-bar {
                background-color: ${theme.highContrastLight};
                color: ${theme.highContrastDark};
                display: flex;
                justify-content: space-between;
                padding: 1em 1.2em;
                position: sticky;
            }
            
            .title {
                text-transform: uppercase;
                font-weight: bold;
            }
            
            .separator {
                height: 2px;
                background-color: ${theme.highContrastDark}33;
                border-radius: 20px;
                margin: 0 1.2em;
            }
            
            ul {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
            }
            
            ul a, ul span {
                display: inline-block;
                margin: 0 0.6em;
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
    </>
}

export default TitleBar;
