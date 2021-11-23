import { useRouter } from "next/router";
import TitleBar from "../../../components/TitleBar";
import ProfileNavBar from "../../../components/profile/ProfileNavBar";
import Auth from "../../../utils/auth";
import BuildsList from "../../../containers/BuildsList";
import axios from "axios";
import { useEffect, useState } from "react";

const UserBuilds = ({}) => {
    const [data, setData] = useState();
    const [error, setError] = useState();

    const router = useRouter();
    const { userId } = router.query;

    useEffect(() => {
        if (userId !== undefined && data === undefined && error === undefined) {
            axios.get(process.env.BACKEND_ENDPOINT + `/user/${userId}/builds`).then(res => {
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
        <BuildsList builds={data?.builds || []} heading={<h3>{data?.username + "'s Builds"}</h3>} />
    </div>;
}

export default UserBuilds;
