import {useRouter} from "next/router";
import TitleBar from "../../../components/TitleBar";
import ProfileNavBar from "../../../components/profile/ProfileNavBar";
import Auth from "../../../utils/auth";
import BuildsList from "../../../containers/BuildsList";
import { useEffect, useState } from "react";
import axios from "axios";

const UserFavorites = ({}) => {
    const [data, setData] = useState();
    const [error, setError] = useState();

    const router = useRouter();
    const { userId } = router.query;

    useEffect(() => {
        if (userId !== undefined && data === undefined && error === undefined) {
            axios.get(process.env.BACKEND_ENDPOINT + `/user/${userId}/favorites`).then(res => {
                setData(res.data);
            }).catch(err => setError(err))
        }
    }, [userId]);

    const isOwnProfile = Auth.getUser()?.id === userId;
    const loading = data === undefined && error === undefined;

    if (loading) return <div />;

    return <div>
        <TitleBar />
        <ProfileNavBar userId={userId} isOwnProfile={isOwnProfile} />
        <BuildsList builds={data?.favorites || []} heading={<h3>{data?.username + "'s Favorite Builds"}</h3>} />
    </div>;
}

export default UserFavorites;
