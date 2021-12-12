import Link from 'next/link';
import {useRouter} from "next/router";
import TitleBar from "../../components/TitleBar";
import Auth from "../../utils/auth";
import {useEffect, useState} from "react";
import axios from "axios";
import BuildsList from "../../containers/BuildsList";
import {Build, User} from "../../interfaces/Builds";
import theme from "../../theme";
import MultipleButton from "../../components/forms/MultipleButton";
import Separator from "../../components/icons/Separator";

interface ProfileNavBarProps {
    user: User,
    isOwnProfile: boolean,
    tabName: "builds" | "favorites" | "saves",
}

const ProfileNavBar = ({ user, isOwnProfile, tabName = "builds" }: ProfileNavBarProps ) => {
    let active;

    if (tabName === "builds") {
        active = 0;
    } else if (tabName === "favorites") {
        active = 1;
    } else if (tabName === "saves") {
        active = 2;
    }

    return <div>
        <MultipleButton active={active}>
            <Link href={"/user/" + user.uuid}><span>Builds</span></Link>
            <Link href={"/user/" + user.uuid + "/favorites"}><span>Favorites</span></Link>
            {isOwnProfile ? <Link href={"/user/" + user.uuid + "/saves"}><span>Saves</span></Link> : null}
        </MultipleButton>
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
}

const ProfilePage = ({ tabName = "builds" }: { tabName: "builds" | "favorites" | "saves" }) => {
    const [user, setUser] = useState<User>();
    const [error, setError] = useState();

    const [builds, setBuilds] = useState<Build[]>(null);

    const router = useRouter();
    const { uuid } = router.query;
    const userObject = Auth.getUser();
    const isOwnProfile = userObject?.id === uuid;

    useEffect(() => {
        if (uuid !== undefined &&
            userObject !== undefined &&
            user === undefined &&
            error === undefined) {
            axios.get(process.env.BACKEND_ENDPOINT + `/user/${uuid}`).then(res => {
                setUser(res.data);
            }).catch(err => setError(err))

            if (tabName === "favorites") {
                axios.get(process.env.BACKEND_ENDPOINT + `/user/${uuid}/favorites`).then(res => {
                    setBuilds(res.data);
                }).catch(err => setError(err));
            } else if (tabName === "saves") {
                axios.get(process.env.BACKEND_ENDPOINT + `/user/${uuid}/saves`, {
                    params: {
                        token: userObject.token,
                    }
                }).then(res => {
                    setBuilds(res.data);
                }).catch(err => setError(err));
            } else {
                axios.get(process.env.BACKEND_ENDPOINT + `/builds/get`, {
                    params: {
                        uuid,
                    }
                }).then(res => {
                    setBuilds(res.data);
                }).catch(err => setError(err));
            }
        }
    }, [uuid, userObject]);

    if (!user) {
        return <div>Loading...</div>
    }

    return <div>
        <TitleBar active={isOwnProfile ? "profile" : null} floating={true} />
        <div className="profile-banner">
            <div className="profile-banner-content">
                <div /><div />
                <div className="user-info">
                    <div className="avatar" />
                    <h2 className="username">{user.username}</h2>
                </div>
            </div>
            {/*<div className="profile-mask" />*/}
        </div>
        <div className="content">
            <ProfileNavBar user={user} tabName={tabName} isOwnProfile={isOwnProfile} />
            <BuildsList builds={builds || []} />
        </div>
        <style jsx>
            {`               
                .profile-banner {
                  background: no-repeat center url("${builds?.length && builds[0].images?.length && process.env.BACKEND_ENDPOINT + "/files/" + builds[0]?.images[0]}");
                }
                
                .profile-banner-content {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  grid-template-rows: 1fr 1fr;
                  padding: 2em;
                  backdrop-filter: blur(2px);
                  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%);
                  min-height: 200px;
                }
                
                .user-info {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  align-self: end;
                }
                
                .username {
                  color: ${theme.highContrastLight};
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
                }
            `}
        </style>
    </div>;
}

export default ProfilePage;