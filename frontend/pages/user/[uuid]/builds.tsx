import ProfilePage from "../../../components/profile/ProfilePage";
import CardsGridView from "../../../containers/CardsGridView";
import { Build } from "../../../interfaces/Builds";
import { useRouter } from "next/router";
import useApi from "../../../components/hooks/useApi";

const Builds = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [builds, loading, error] = useApi<Build[]>(
    "/builds/get",
    { params: { uuid } },
    [uuid]
  );

  return (
    <ProfilePage count={builds?.length}>
      <CardsGridView builds={builds || []} />
    </ProfilePage>
  );
};

export default Builds;
