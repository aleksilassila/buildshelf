import theme from "../theme";
import Link from 'next/link';

const TitleBar = () => {
    return (
        <div className="title-bar">
            <span className="title">Litematica Library</span>
            <ul>
                <Link href="/"><a>Home</a></Link>
                <Link href="/builds"><a>Browse Builds</a></Link>
                <Link href="/login"><a>Log In</a></Link>
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
                
                ul a {
                    display: inline-block;
                    margin: 0 0.6em;
                    cursor: pointer;
                    font-weight: 100;
                    text-transform: uppercase;
                    font-size: 0.8em;
                    color: inherit;
                    text-decoration: none;
                }
                
                ul a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}

export default TitleBar;
