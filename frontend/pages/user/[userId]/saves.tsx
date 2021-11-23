import {useRouter} from "next/router";
import TitleBar from "../../../components/TitleBar";
import ProfileNavBar from "../../../components/profile/ProfileNavBar";
import Auth from "../../../utils/auth";
import BuildsList from "../../../containers/BuildsList";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import axios from "axios";

const UserSaves = ({}) => {
    const [data, setData] = useState();
    const [error, setError] = useState();

    const router = useRouter();
    const { userId } = router.query;

    const userObject = Auth.getUser();

    useEffect(() => {
        if (userId !== undefined && data === undefined && error === undefined) {
            axios.get(process.env.BACKEND_ENDPOINT + `/user/${userId}/saves?token=${userObject?.token}`).then(res => {
                setData(res.data);
            }).catch(err => setError(err))
        }
    }, [userId]);

    const isOwnProfile = userObject?.id === userId;
    const loading = data === undefined && error === undefined;

    if (loading) return <div />;
    if (!isOwnProfile) return <p>You don't have access to these.</p>

    return <div>
        <TitleBar />
        <ProfileNavBar userId={userId} isOwnProfile={isOwnProfile} />
        <BuildsList builds={data?.saves || []} heading={loading ? <h3>Loading</h3> : <h3>Your saved builds</h3>} />
    </div>;
}

export default UserSaves;
