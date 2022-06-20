import Link from "next/link";
import theme from "../../constants/theme";
import {User} from "../../interfaces/ApiResponses";

interface Props {
  user: User;
  isOwnProfile: boolean;
}

const ProfileNavBar = ({ user, isOwnProfile }: Props) => {
  return (
    <div className="profile-nav-bar">
      <div className="user-info">
        <div className="avatar" />
        <h2 className="username">{user.username}</h2>
      </div>
      <div className="list">
        <Link href={"/users/" + user.uuid}>
          <a>Profile</a>
        </Link>
        <Link href={"/users/" + user.uuid + "/builds"}>
          <a>{isOwnProfile ? "Your Builds" : "Builds"}</a>
        </Link>
        <Link href={"/users/" + user.uuid + "/saves"}>
          <a>Saved Builds</a>
        </Link>
        {isOwnProfile && (
          <Link href={"/users/" + user.uuid + "/bookmarks"}>
            <a>Bookmarks</a>
          </Link>
        )}
      </div>
      <style jsx>
        {`
          .profile-nav-bar {
            color: ${theme.darkHighContrast};
            display: flex;
            justify-content: space-between;
            padding: 1em;
            margin: 2em;
            border-bottom: 1px solid ${theme.lightLowContrast};
          }

          .user-info {
            display: flex;
            flex-direction: row;
            align-items: center;
          }

          .avatar {
            background: url("https://crafatar.com/avatars/${user.uuid}");
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            width: 2.5em;
            height: 2.5em;
            display: inline-block;
            margin-right: 0.5em;
          }

          .list {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 0 -0.5em;
          }

          .list a,
          .list span {
            color: inherit;
            margin: 0 0.5em;
            text-decoration: none;
            font-weight: 500;
          }

          .list a:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  );
};

export default ProfileNavBar;
