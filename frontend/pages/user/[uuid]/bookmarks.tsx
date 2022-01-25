import ProfilePage from "../../../components/profile/ProfilePage";
import CardsGridView from "../../../containers/CardsGridView";
import {useApi} from "../../../components/hooks/api";
import {Build} from "../../../interfaces/ApiResponses";
import {useRouter} from "next/router";

const Saves = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [builds, loading, error] = useApi<Build[]>(
    "/user/" + uuid + "/bookmarks",
    { params: { uuid } },
    [uuid], true
  );

  return (
    <ProfilePage tabName="bookmarks" count={builds?.length}>
      <CardsGridView builds={builds || []} error={error} loading={loading} />
    </ProfilePage>
  );
};

export default Saves;
