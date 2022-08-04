import { useRouter } from "next/router";
import Navbar from "../navbar/Navbar";
import Auth from "../../utils/auth";
import { useState } from "react";
import { User } from "../../interfaces/ApiResponses";
import Button from "../ui/Button";
import Heart from "../icons/Heart";
import NBSP from "../utils/NBSP";
import { apiRequest, useApi } from "../../utils/api";
import ProfileNavBar from "./ProfileNavBar";

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

const Profile = ({
  activeHref = null,
  count,
  bannerUrl = null,
  children,
}: {
  activeHref: string;
  count?: number;
  bannerUrl?: string;
  children?: JSX.Element;
}) => {
  const router = useRouter();
  const { uuid } = router.query;

  const [user, loading, error] = useApi<User>("/users/" + uuid, {}, [uuid]);

  const [followed, setFollowed] = useState(false);

  const userObject = Auth.getUser();
  const isOwnProfile = userObject.isLoggedIn(uuid?.toString());

  const follow = () => {
    apiRequest({
      method: "POST",
      url: "/users/" + uuid + "/follow",
      data: {
        follow: !followed,
      },
    })
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
      <Navbar active={activeHref} />
      <div
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
              url("${bannerUrl || "/blueprint.jpeg"}") no-repeat center center`,
          backgroundSize: "cover",
        }}
      >
        <div className="h-40 md:h-56 p-4 backdrop-blur-sm grid grid-cols-2 grid-rows-2 md:p-6">
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
              <Button onClick={follow} mode={!followed ? "primary" : "default"}>
                <Heart style={{ height: "0.8em" }} />
                {NBSP}
                {followed ? "Unfollow" : "Follow"}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t-2 border-t-stone-300 py-6 px-4 md:px-8 lg:px-16 flex flex-col gap-4">
        <ProfileNavBar
          user={user}
          activeHref={activeHref}
          isOwnProfile={isOwnProfile}
          count={count}
        />
        {children}
      </div>
    </div>
  );
};

export default Profile;
