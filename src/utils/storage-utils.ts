import { EAuthToken } from "../interfaces/user-interfaces";

export const saveStorageToken = (accessToken: string) => {
  localStorage.setItem(EAuthToken.ACCESS_TOKEN, accessToken);
};

export const getStorageToken = () => {
  return localStorage.getItem(EAuthToken.ACCESS_TOKEN);
};
