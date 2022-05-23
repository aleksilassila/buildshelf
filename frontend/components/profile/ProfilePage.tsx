import Link from "next/link";
import { useRouter } from "next/router";
import TitleBar, { ActiveSub } from "../bars/TitleBar";
import Auth from "../../utils/auth";
import { useState } from "react";
import axios from "axios";
import { User } from "../../interfaces/ApiResponses";
import theme from "../../constants/theme";
import Button from "../ui/Button";
import Heart from "../icons/Heart";
import NBSP from "../utils/NBSP";
import { useApi } from "../../utils/api";

/*
when joined?
build count
received favorites count

(builds / manage)
(bookmarks?)
(collections / manage)
(edit profile)
 - Delete account
 - Change description
•
 */

const ProfilePage = ({
  tabName = "profile",
  count,
  bannerUrl = null,
  children,
}: {
  tabName?: ActiveSub;
  count?: number;
  bannerUrl?: string;
  children?: JSX.Element;
}) => {
  const router = useRouter();
  const { uuid } = router.query;

  const [user, loading, error] = useApi<User>("/user/" + uuid, {}, [uuid]);

  const [followed, setFollowed] = useState(false);

  const userObject = Auth.getUser();
  const isOwnProfile = userObject?.uuid === uuid;

  const follow = () => {
    axios
      .post(
        process.env.BACKEND_ENDPOINT + `/user/${uuid}/follow`,
        {
          follow: !followed,
        },
        {
          params: {
            token: userObject?.token,
          },
        }
      )
      .then((res) => {
        setFollowed(!followed);
      })
      .catch((err) => {});
  };

  if (!user) {
    return null;
    // return (
    //   <Status fullscreen>
    //     <h2>{messages.loading}</h2>
    //   </Status>
    // );
  }

  return (
    <div>
      <TitleBar active={isOwnProfile ? tabName : null} />
      <div className="profile-banner">
        <div className="profile-banner-content">
          <div />
          <div className="user-stats">{/*<span>Builds: 13</span>*/}</div>
          <div className="user-info">
            <div className="avatar" />
            <h2 className="username">{user.username}</h2>
          </div>
          {userObject.isLoggedIn() && userObject.uuid !== uuid ? (
            <Button onClick={follow} primary={!followed}>
              <Heart style={{ height: "0.8em" }} />
              {NBSP}
              {followed ? "Unfollow" : "Follow"}
            </Button>
          ) : (
            <div />
          )}
        </div>
        {/*<div className="profile-mask" />*/}
      </div>
      <div className="medium-page-container">
        <ProfileNavBar
          user={user}
          tabName={tabName}
          isOwnProfile={isOwnProfile}
          count={count}
        />
        {children}
      </div>
      <style jsx>
        {`
          .profile-banner {
            background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
              url("${bannerUrl || "/blueprint.jpeg"}") no-repeat center center;
            background-size: cover;
          }

          .medium-page-container {
            border-top: 3px solid ${theme.lightLowContrast};
          }

          .profile-banner-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            padding: 2em;
            backdrop-filter: blur(2px);
            //background: linear-gradient(
            //  180deg,
            //  rgba(0, 0, 0, 0) 0%,
            //  rgba(0, 0, 0, 0) 40%,
            //  rgba(0, 0, 0, 0.7) 100%
            //);
            min-height: 200px;
          }

          .profile-banner-content > :global(.button) {
            align-self: end;
            justify-self: right;
          }

          .user-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            align-self: end;
          }

          .username {
            color: ${theme.lightHighContrast};
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

          .user-stats,
          .user-stats > :global(*) {
            color: ${theme.lightHighContrast};
          }
        `}
      </style>
    </div>
  );
};

interface ProfileNavBarProps {
  user: User;
  isOwnProfile: boolean;
  tabName?: ActiveSub;
  count: number;
}

const ProfileNavBar = ({
  user,
  isOwnProfile,
  count = null,
  tabName = "profile",
}: ProfileNavBarProps) => {
  const getCount = (t) => (tabName === t && count !== null ? `(${count})` : "");

  return (
    <div className="profile-bar">
      <Link href={"/user/" + user.uuid}>
        <div className={`${tabName === "profile" && "active"} item`}>
          Builds {getCount("profile")}
        </div>
      </Link>
      <Link href={"/user/" + user.uuid + "/collections"}>
        <div className={`${tabName === "collections" && "active"} item`}>
          Collections {getCount("collections")}
        </div>
      </Link>
      <Link href={"/user/" + user.uuid + "/saves"}>
        <div className={`${tabName === "saves" && "active"} item`}>
          Saves {getCount("saves")}
        </div>
      </Link>

      {isOwnProfile ? (
        <Link href={"/user/" + user.uuid + "/bookmarks"}>
          <div className={`${tabName === "bookmarks" && "active"} item`}>
            Bookmarks {getCount("bookmarks")}
          </div>
        </Link>
      ) : null}
      <style jsx>
        {`
          .profile-bar {
            display: flex;
            //margin: 0 -0.5em;
            //padding: 0 0 0.5em 0;
            align-items: stretch;
            height: 2em;
            border-bottom: 2px solid ${theme.lightLowContrast};
            margin-bottom: 1em;
          }

          .item {
            font-weight: 600;
            padding: 0 0.5em;
            cursor: pointer;
            margin-bottom: -2px;
          }

          .active {
            color: ${theme.layoutDark};
            border-bottom: 2px solid ${theme.layoutDark};
          }
        `}
      </style>
    </div>
  );
};

export default ProfilePage;
