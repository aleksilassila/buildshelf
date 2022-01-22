import ProfilePage from "../../../components/profile/ProfilePage";
import CardsGridView from "../../../containers/CardsGridView";
import {Build} from "../../../interfaces/ApiResponses";
import {useRouter} from "next/router";
import {useApi} from "../../../components/hooks/api";

const Favorites = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [builds, loading, error] = useApi<Build[]>(
    "/user/" + uuid + "/favorites",
    { params: { uuid } },
    [uuid]
  );

  return (
    <ProfilePage tabName="favorites" count={builds?.length}>
      <CardsGridView builds={builds || []} error={error} loading={loading} />
    </ProfilePage>
  );
};


export default Favorites;
