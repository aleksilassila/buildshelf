import ProfilePage from "../../../components/profile/ProfilePage";
import { Collection } from "../../../interfaces/ApiResponses";
import { useRouter } from "next/router";
import ListView from "../../../containers/ListView";
import CollectionCard from "../../../components/CollectionCard";
import { useApi } from "../../../utils/api";

const Collections = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [collections, loading, error] = useApi<Collection[]>(
    "/collections/search",
    { params: { uuid } },
    [uuid]
  );

  return (
    <ProfilePage tabName="user-collections" count={collections?.length}>
      <ListView loading={loading} error={error}>
        {(collections || []).map((item, index) => (
          <CollectionCard key={index} collection={item} />
        ))}
      </ListView>
    </ProfilePage>
  );
};

export default Collections;
