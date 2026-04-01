import { EAuthToken } from "../interfaces/user-interfaces";

export const saveStorageToken = (accessToken: string) => {
  localStorage.setItem(EAuthToken.ACCESS_TOKEN, accessToken);
};

export const getStorageToken = () => {
  return localStorage.getItem(EAuthToken.ACCESS_TOKEN);
};

export const safeJSONParse = <T,>(val: string | null, fallback: T | null = null): T | null => {
  if (!val || val === "undefined") return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};
