import { useRouter } from "next/router";
import TitleBar from "../../components/TitleBar";

const Profile = ({}) => {
    const router = useRouter();
    const { userId } = router.query;

    // const [{ data, loading, error }, refetch] = useAxios(process.env.BACKEND_ENDPOINT + `/builds/${buildId}`);

    return <div>
        <TitleBar />
        Profile {userId}
    </div>;
}

export default Profile;