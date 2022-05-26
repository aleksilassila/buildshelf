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
    <div className="flex flex-col">
      <TitleBar active={isOwnProfile ? tabName : null} />
      <div
        className="bg-cover"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
              url("${bannerUrl || "/blueprint.jpeg"}") no-repeat center center`,
        }}
      >
        <div className="h-40 md:h-56 p-4 backdrop-blur-sm grid grid-cols-2 grid-rows-2 md:p-6">
          {/*<div className="">/!*<span>Builds: 13</span>*!/</div>*/}
          <div className="row-start-2 col-start-1 flex items-end">
            <div className="flex flex-row items-center gap-2 md:gap-4">
              <div
                style={{
                  backgroundImage: `url('https://crafatar.com/avatars/${user.uuid}')`,
                }}
                className={`w-10 h-10 bg-contain bg-center bg-no-repeat md:w-12 md:h-12`}
              />
              <h2 className="text-white font-bold text-lg md:text-xl">
                {user.username}
              </h2>
            </div>
          </div>
          {userObject.isLoggedIn() && userObject.uuid !== uuid ? (
            <div className="row-start-2 col-start-2 flex items-end justify-end">
              <Button onClick={follow} primary={!followed}>
                <Heart style={{ height: "0.8em" }} />
                {NBSP}
                {followed ? "Unfollow" : "Follow"}
              </Button>
            </div>
          ) : null}
        </div>
        {/*<div className="profile-mask" />*/}
      </div>
      <div className="border-t-2 border-t-stone-300 py-6 px-4 md:px-8 lg:px-16">
        <ProfileNavBar
          user={user}
          tabName={tabName}
          isOwnProfile={isOwnProfile}
          count={count}
        />
        {children}
      </div>
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
