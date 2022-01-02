import Link from "next/link";
import { useRouter } from "next/router";
import TitleBar from "../bars/TitleBar";
import Auth from "../../utils/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import CardsGridView from "../../containers/CardsGridView";
import { Build, User } from "../../interfaces/Builds";
import theme from "../../constants/theme";
import MultipleButton, { MultipleButtonData } from "../common/MultipleButton";
import Separator from "../../components/icons/Separator";
import SplashText from "../statuses/SplashText";
import messages from "../../constants/messages";
import Button from "../common/Button";

interface ProfileNavBarProps {
  user: User;
  isOwnProfile: boolean;
  tabName: "builds" | "favorites" | "saves";
}

const ProfileNavBar = ({
  user,
  isOwnProfile,
  tabName = "builds",
}: ProfileNavBarProps) => {
  const tabButtonData: MultipleButtonData[] = [
    {
      content: (
        <Link href={"/user/" + user.uuid}>
          <span>Builds</span>
        </Link>
      ),
      active: tabName === "builds",
    },
    {
      content: (
        <Link href={"/user/" + user.uuid + "/favorites"}>
          <span>Favorites</span>
        </Link>
      ),
      active: tabName === "favorites",
    },
  ];

  if (isOwnProfile) {
    tabButtonData.push({
      content: (
        <Link href={"/user/" + user.uuid + "/saves"}>
          <span>Saves</span>
        </Link>
      ),
      active: tabName === "saves",
    });
  }

  return (
    <div>
      <MultipleButton data={tabButtonData} />
      {Separator}
      <style jsx>
        {`
          span {
            font-size: 0.9em;
            font-weight: 600;
          }
        `}
      </style>
    </div>
  );
};

const ProfilePage = ({
  tabName = "builds",
}: {
  tabName: "builds" | "favorites" | "saves";
}) => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState();
  const [followed, setFollowed] = useState(false);

  const [builds, setBuilds] = useState<Build[]>(null);

  const router = useRouter();
  const { uuid } = router.query;
  const userObject = Auth.getUser();
  const isOwnProfile = userObject?.uuid === uuid;

  useEffect(() => {
    if (
      uuid === undefined ||
      userObject === undefined ||
      user !== undefined ||
      error !== undefined
    )
      return;

    axios
      .get(process.env.BACKEND_ENDPOINT + `/user/${uuid}`)
      .then((res) => {
        setUser(res.data);
        setFollowed(res.data?.followers?.indexOf(uuid) !== -1);
      })
      .catch(setError);

    if (tabName === "favorites") {
      axios
        .get(process.env.BACKEND_ENDPOINT + `/user/${uuid}/favorites`, {
          params: {
            token: userObject?.token,
          },
        })
        .then((res) => {
          setBuilds(res.data);
        })
        .catch(setError);
    } else if (tabName === "saves") {
      axios
        .get(process.env.BACKEND_ENDPOINT + `/user/${uuid}/saves`, {
          params: {
            token: userObject.token,
          },
        })
        .then((res) => {
          setBuilds(res.data);
        })
        .catch(setError);
    } else {
      axios
        .get(process.env.BACKEND_ENDPOINT + `/builds/get`, {
          params: {
            uuid,
            token: userObject?.token,
          },
        })
        .then((res) => {
          setBuilds(res.data);
        })
        .catch(setError);
    }
  }, [uuid, userObject]);

  const follow = () => {
    axios
      .post(
        process.env.BACKEND_ENDPOINT + `/user/${uuid}/follow`,
        {
          follow: !followed,
        },
        {
          params: {
            token: userObject.token,
          },
        }
      )
      .then((res) => {
        setFollowed(!followed);
      })
      .catch((err) => {});
  };

  if (!user) {
    return (
      <SplashText fullscreen>
        <h2>{messages.loading}</h2>
      </SplashText>
    );
  }

  return (
    <div>
      <TitleBar active={isOwnProfile ? "profile" : null} floating={true} />
      <div className="profile-banner">
        <div className="profile-banner-content">
          <div />
          <div />
          <div className="user-info">
            <div className="avatar" />
            <h2 className="username">{user.username}</h2>
          </div>
          <Button onClick={follow} highlighted={!followed}>
            {followed ? "Unfollow" : "Follow"}
          </Button>
        </div>
        {/*<div className="profile-mask" />*/}
      </div>
      <div className="content">
        <ProfileNavBar
          user={user}
          tabName={tabName}
          isOwnProfile={isOwnProfile}
        />
        <CardsGridView builds={builds || []} />
      </div>
      <style jsx>
        {`
          .profile-banner {
            background: no-repeat center
              url("${builds?.length &&
              builds[0].images?.length &&
              process.env.BACKEND_ENDPOINT +
                "/files/" +
                builds[0]?.images[0]}");
          }

          .profile-banner-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            padding: 2em;
            backdrop-filter: blur(2px);
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0) 40%,
              rgba(0, 0, 0, 0.7) 100%
            );
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

          .content {
            padding: 2em;
            border-top: 3px solid ${theme.lightLowContrast};
          }
        `}
      </style>
    </div>
  );
};

export default ProfilePage;
