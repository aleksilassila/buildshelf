import { useRouter } from "next/router";
import TitleBar from "../../components/TitleBar";
import ProfileNavBar from "../../components/profile/ProfileNavBar";
import Auth from "../../utils/auth";

const Profile = ({}) => {
    const router = useRouter();
    const { userId } = router.query;

    const isOwnProfile = Auth.getUser()?.id === userId;

    // const [{ data, loading, error }, refetch] = useAxios(process.env.BACKEND_ENDPOINT + `/builds/${buildId}`);

    return <div>
        <TitleBar />
        <ProfileNavBar userId={userId} isOwnProfile={isOwnProfile} />
        Profile {userId}
    </div>;
}

export default Profile;
