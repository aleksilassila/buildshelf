import Profile from "../../../components/profile/Profile";
import CardsGridView from "../../../containers/CardsGridView";
import { useApi } from "../../../utils/api";
import { Build } from "../../../interfaces/ApiResponses";
import { useRouter } from "next/router";
import Auth from "../../../utils/auth";

const Saves = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [builds, loading, error] = useApi<Build[]>(
    "/users/" + uuid + "/bookmarks",
    { params: { uuid } },
    [uuid],
    true
  );

  return (
    <Profile
      activeHref={"/users/" + Auth.getUser()?.uuid + "/bookmarks"}
      count={builds?.length}
    >
      <CardsGridView builds={builds || []} error={error} loading={loading} />
    </Profile>
  );
};

export default Saves;
