import {useRouter} from "next/router";
import TitleBar from "../../components/TitleBar";

const Build = ({}) => {
    const router = useRouter();
    const { buildId } = router.query;

    const [{ data, loading, error }, refetch] = useAxios(process.env.BACKEND_ENDPOINT + `/builds/${buildId}`);

    return <div>
        <TitleBar />
    </div>;
}

export default Build;