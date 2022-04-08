import {useRouter} from "next/router";

const Authorize = () => {
  const router = useRouter();
  const { code } = router.query;

  const [build, loading, error] = useApi<Build>("/build/" + buildId, {}, [
    buildId,
  ]);

  return <div />;
}

export default Authorize;