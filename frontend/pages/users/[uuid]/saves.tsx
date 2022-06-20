import ProfilePage from "../../../components/profile/ProfilePage";
import CardsGridView from "../../../containers/CardsGridView";
import {Build} from "../../../interfaces/ApiResponses";
import {useRouter} from "next/router";
import {useApi} from "../../../utils/api";

const Saves = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [builds, loading, error] = useApi<Build[]>(
    "/users/" + uuid + "/saves",
    { params: { uuid } },
    [uuid]
  );

  return (
    <ProfilePage tabName="saves" count={builds?.length}>
      <CardsGridView builds={builds || []} error={error} loading={loading} />
    </ProfilePage>
  );
};

export default Saves;
