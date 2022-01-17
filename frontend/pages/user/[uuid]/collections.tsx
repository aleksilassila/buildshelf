import ProfilePage from "../../../components/profile/ProfilePage";
import useApi from "../../../components/hooks/api";
import {Collection} from "../../../interfaces/Builds";
import {useRouter} from "next/router";
import ListView from "../../../containers/ListView";
import CollectionCard from "../../../components/CollectionCard";

const Collections = () => {
  const router = useRouter();
  const {uuid} = router.query;

  const [collections, loading, error] = useApi<Collection[]>(
    "/collections/get",
    {params: {uuid}},
    [uuid]
  );

  return (
    <ProfilePage tabName="collections" count={collections?.length}>
      <ListView>
        {(collections || []).map((item, index) => (
          <CollectionCard key={index} collection={item}/>
        ))}
      </ListView>
    </ProfilePage>
  );
};

export default Collections;