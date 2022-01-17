import ProfilePage from "../../../components/profile/ProfilePage";
import CardsGridView from "../../../containers/CardsGridView";
import {Build} from "../../../interfaces/Builds";
import useApi from "../../../components/hooks/api";
import {useRouter} from "next/router";

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
      <CardsGridView builds={builds || []} />
    </ProfilePage>
  );
};


export default Favorites;
