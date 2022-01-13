import { useEffect, useState } from "react";
import Auth from "../../utils/auth";
import axios, { AxiosRequestConfig } from "axios";

const useApi = <S>(
  uri: string,
  config: AxiosRequestConfig,
  deps: any[]
): [data: S | null, loading: boolean, error: Error | null] => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userObject = Auth.getUser();

  useEffect(() => {
    if (
      userObject === undefined ||
      error !== null ||
      deps.indexOf(undefined) !== -1 ||
      loading === true ||
      data !== null
    )
      return;

    setLoading(true);

    axios(process.env.BACKEND_ENDPOINT + uri, {
      ...config,
      params: {
        ...config?.params,
        token: userObject?.token,
      },
    })
      .then((res) => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [uri].concat(deps));

  return [data, loading, error];
};

export default useApi;
