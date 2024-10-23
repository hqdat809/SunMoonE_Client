/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { EAuthToken } from "../interfaces/user-interfaces";
import { AUTH } from "../routes/paths";
import { getStorageToken } from "../utils/storage-utils";

const instance = axios.create({
  // baseURL: "https://public.kiotapi.com", // Replace with your API URL
  baseURL: import.meta.env.VITE_API_URL, // Replace with your API URL
  timeout: 100000, // Set request timeout (optional)
  headers: {
    "Content-Type": "application/json",
  },
});

const requestHandler = (config: any) => {
  const atk = localStorage.getItem(EAuthToken.ACCESS_TOKEN);

  if (atk) {
    const tempHeaders = {
      ...config.headers,
      Authorization: `Bearer ${atk}`,
    };
    config.headers = tempHeaders;
    config.params = {
      ...config.params,
      version: Date.now(),
    };
  }

  return config;
};

let isRefreshing = false;

const refreshAccessToken = async () => {
  try {
    const response = await axios
      .create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            EAuthToken.REFRESH_TOKEN
          )}`,
        },
      })
      .post("/v1/auth/refresh", {
        refreshToken: localStorage.getItem(EAuthToken.REFRESH_TOKEN),
      });
    return response.data;
  } catch (error) {
    localStorage.removeItem(EAuthToken.ACCESS_TOKEN);
    localStorage.removeItem(EAuthToken.REFRESH_TOKEN);
    localStorage.removeItem("persist:root");
    // window.location.href = AUTH;
  }
};

instance.interceptors.request.use(requestHandler, (error) => {
  return Promise.reject(error);
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If response status is 401 (Unauthorized) and we haven't already started token refresh
    if (error?.response?.status === 403 && !isRefreshing && getStorageToken()) {
      isRefreshing = true;

      const newAccessToken = await refreshAccessToken();
      localStorage.setItem(EAuthToken.ACCESS_TOKEN, newAccessToken.token);
      localStorage.setItem(
        EAuthToken.REFRESH_TOKEN,
        newAccessToken.refreshToken
      );

      // Update the Authorization header for the original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken.token}`;

      isRefreshing = false;
      // Retry the original request
      return instance(originalRequest);
    }

    const data: any = error?.response?.data;
    const message = data?.message;

    // if (message) throw new Error(message);

    // If token refresh failed or there was another error, reject the request
    return Promise.reject(error);
  }
);

export { instance as ApiClient };
