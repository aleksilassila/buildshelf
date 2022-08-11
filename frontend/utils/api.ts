import { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Router from "next/router";
import { getLocalUser, storeLocalUser, useLocalUser } from "./auth";

const useApi = <S>(
  uri: string,
  config: AxiosRequestConfig,
  deps: any[],
  requiresAuth = false
): [
  data: S | null,
  loading: boolean,
  error: Error | null,
  refetch: (config?: AxiosRequestConfig) => Promise<AxiosResponse>
] => {
  const [values, setValues] = useState({
    data: null,
    loading: null,
    error: null,
  });

  const localUser = useLocalUser();

  const fetch = useCallback((_config = config): Promise<AxiosResponse> => {
    if (values.loading || (!localUser.isLoggedIn() && requiresAuth)) return;

    setValues({ ...values, loading: true });

    return apiRequest({
      url: uri,
      ..._config,
    })
      .then((res) => {
        setValues({ ...values, data: res.data, loading: false });
        return res;
      })
      .catch((error: AxiosError) => {
        setValues({ ...values, loading: false, error });

        return error.response;
      });
  }, [uri, localUser, values.loading].concat(deps));

  useEffect(() => {
    if (
      localUser === undefined ||
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

  const localUser = useLocalUser();

  const refetch = (config, page = 0) => {
    setValues({ ...values, loading: true });
    setPage(page);

    apiRequest({
      url: uri,
      ...config,
      params: {
        ...config.params,
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
      localUser === undefined ||
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

const apiRequest = async <P = any>(config): Promise<AxiosResponse<P>> => {
  return axios({
    ...config,
    url: process.env.BACKEND_ENDPOINT + config.url,
    params: {
      ...config.params,
      token: getLocalUser()?.token,
    },
  }).catch((error: AxiosError<any>) => {
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.error?.code === "INVALID_TOKEN"
    ) {
      storeLocalUser(null);
      try {
        Router.replace(process.env.MICROSOFT_REDIRECT_URL);
      } catch (ignored) {}
    }
    throw error;
  });
};

export { useApi, useApiFeed, apiRequest };
