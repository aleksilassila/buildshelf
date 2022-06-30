import ProfilePage from "../../../components/profile/ProfilePage";
import CardsGridView from "../../../containers/CardsGridView";
import { Build } from "../../../interfaces/ApiResponses";
import { useRouter } from "next/router";
import { useApi } from "../../../utils/api";
import Button from "../../../components/ui/Button";
import Link from "next/link";
import Auth from "../../../utils/auth";

const Builds = () => {
  const router = useRouter();
  const { uuid: creatorUuid } = Array.isArray(router.query)
    ? router.query[0]
    : router.query;

  const userObject = Auth.getUser();

  const [builds, loading, error] = useApi<Build[]>(
    "/builds/search",
    { params: { creatorUuid } },
    [creatorUuid]
  );

  const CreateBuild = () => (
    <div>
      <Link href="/upload">
        <Button onClick={() => {}} mode="primary">
          Upload Build
        </Button>
      </Link>
    </div>
  );

  return (
    <ProfilePage count={builds?.length}>
      {builds?.length === 0 && userObject.isLoggedIn(creatorUuid) ? (
        <div className="flex">
          <CreateBuild />
        </div>
      ) : (
        <CardsGridView builds={builds || []} error={error} loading={loading} />
      )}
    </ProfilePage>
  );
};

export default Builds;
