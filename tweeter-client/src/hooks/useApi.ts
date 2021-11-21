import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

export const useApi = (url: string, config?: AxiosRequestConfig) => {
  const [data, setData] = useState<any | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const doApi = async (url: string, config?: AxiosRequestConfig) => {
    const handle = window.localStorage.getItem("auth:me");
    const conf = handle
      ? {
          headers: {
            "X-Handle": handle,
            ...config?.headers,
          },
          ...(config || {}),
        }
      : config;
    try {
      setLoading(true);
      const d = await axios(url, conf);
      setData(d.data);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    doApi(url, config);
  }, [url, config]);

  return {
    data,
    error,
    loading,
  };
};
