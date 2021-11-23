import Link from 'next/link';
import Auth from "../../utils/auth";
import theme from "../../theme";

interface Props {
    userId: string,
    isOwnProfile: boolean,
}

const ProfileNavBar = ({ userId, isOwnProfile}: Props) => {
    return <div className="profile-nav-bar">
        <div className="list">
            <Link href={"/user/" + userId}><a>Profile</a></Link>
            <Link href={"/user/" + userId + "/builds"}><a>{isOwnProfile ? "Your Builds" : "Builds"}</a></Link>
            <Link href={"/user/" + userId + "/favorites"}><a>Favorite Builds</a></Link>
            {isOwnProfile && <Link href={"/user/" + userId + "/saved"}><a>Saved Builds</a></Link>}
        </div>
        <style jsx>
            {`
                .profile-nav-bar {
                    background-color: ${theme.lowContrastDark};
                    color: ${theme.highContrastLight};
                    display: flex;
                    justify-content: center;
                    padding: 0.7em 0;
                    position: sticky;
                }
                
                .list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                
                .list a, .list span {
                    display: inline-block;
                    margin: 0 0.6em;
                    font-weight: 100;
                    text-transform: uppercase;
                    font-size: 0.8em;
                    color: inherit;
                    text-decoration: none;
                }
                
                .list a:hover {
                    cursor: pointer;
                    text-decoration: underline;
                }
            `}
        </style>
    </div>;
}

export default ProfileNavBar;
