/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { EAuthToken } from "../interfaces/user-interfaces";
import { AUTH } from "../routes/paths";
import { getStorageToken } from "../utils/storage-utils";
import { toastError } from "../utils/notifications-utils";

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

instance.interceptors.request.use(requestHandler, (error) => {
  return Promise.reject(error);
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (error?.response?.status === 403) {
      localStorage.removeItem(EAuthToken.ACCESS_TOKEN);
      localStorage.removeItem(EAuthToken.KIOT_TOKEN);
      localStorage.removeItem("userDetails");
      window.location.href = "/auth";
      toastError("Bạn cần đăng nhập để tiếp tục")
    }

    const data: any = error?.response?.data;
    return Promise.reject(error);
  }
);

export { instance as ApiClient };
