import axios, { AxiosRequestConfig } from "axios";

export const doApi = async (url: string, config?: AxiosRequestConfig) => {
  const handle = window.localStorage.getItem("auth:me");
  console.log(`${url} => ${handle}`);
  const conf = handle
    ? {
        headers: {
          "X-Handle": handle,
          ...config?.headers,
        },
        ...(config || {}),
      }
    : config;

  const d = await axios(url, conf);
  return d.data;
};
