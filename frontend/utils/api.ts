import { useCallback, useEffect, useRef, useState } from "react";
import Auth from "./auth";
import axios, { AxiosRequestConfig } from "axios";

const routes = {
  
}

const responses = {

}

const useApi = <S>(
  uri: string,
  config: AxiosRequestConfig,
  deps: any[],
  requiresAuth = false
): [
  data: S | null,
  loading: boolean,
  error: Error | null,
  refetch: (config?) => void
] => {
  const [values, setValues] = useState({
    data: null,
    loading: null,
    error: null,
  });

  const userObject = Auth.getUser();

  const fetch = useCallback((_config = config) => {
    if (values.loading || (userObject === null && requiresAuth)) return;

    setValues({ ...values, loading: true });

    axios(process.env.BACKEND_ENDPOINT + uri, {
      ..._config,
      params: {
        ..._config?.params,
        token: userObject?.token,
      },
    })
      .then((res) => setValues({ ...values, data: res.data, loading: false }))
      .catch((error) => setValues({ ...values, loading: false, error }));
  }, [uri, userObject].concat(deps));

  useEffect(() => {
    if (
      userObject === undefined ||
      values.error !== null ||
      deps.indexOf(undefined) !== -1 ||
      values.loading === true
      // data.data !== null
    )
      return;

    fetch();
  }, [uri].concat(deps));

  return [
    values.data,
    values.loading !== null ? values.loading : true,
    values.error,
    fetch,
  ];
};

const useApiFeed = <S>(
  uri: string,
  config: AxiosRequestConfig,
  amount = 20
): [
  data: S[] | null,
  loading: boolean,
  error: Error | null,
  fetchMore: () => void,
  refetch: (config, page?: number) => void
] => {
  const [values, setValues] = useState({
    data: [],
    loading: null,
    error: null,
    hasMore: false,
  });
  const hasMoreRef = useRef<any>();
  hasMoreRef.current = values.hasMore;

  const [page, setPage] = useState(0);

  const userObject = Auth.getUser();

  const refetch = (config, page = 0) => {
    setValues({ ...values, loading: true });
    setPage(page);

    axios(process.env.BACKEND_ENDPOINT + uri, {
      ...config,
      params: {
        ...config?.params,
        token: userObject?.token,
        offset: page * amount,
        amount,
      },
    })
      .then((res) =>
        setValues({
          ...values,
          data: page ? values.data.concat(res.data) : res.data,
          loading: false,
          hasMore: res.data?.length === amount,
        })
      )
      .catch((error) =>
        setValues({
          ...values,
          loading: false,
          error,
          hasMore: false,
        })
      );
  };

  const fetchMore = () => {
    if (!hasMoreRef.current) return;
    setPage((p) => p + 1);
  };

  useEffect(() => {
    if (
      userObject === undefined ||
      values.error !== null ||
      values.loading === true
    )
      return;

    refetch(config, page);
  }, [page]);

  return [
    values.data,
    values.loading !== null ? values.loading : true,
    values.error,
    fetchMore,
    refetch,
  ];
};

export { useApi, useApiFeed, routes, responses };