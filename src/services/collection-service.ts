import axios, { AxiosResponse } from "axios";
import {
  ICollections,
  IGetCollectionRequest,
} from "../interfaces/collection-interface";
import { IKiotResponse } from "../interfaces/common";
import { EAuthToken } from "../interfaces/user-interfaces";

export const getCollections = async (payload: IGetCollectionRequest) => {
  try {
    const params = new URLSearchParams(payload as Record<string, string>);
    const response: AxiosResponse<IKiotResponse<ICollections>> =
      await axios.get(`/kiot/categories?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            EAuthToken.KIOT_TOKEN
          )}`,
          Retailer: "thanhthuy1988",
        },
      });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getDetailCollection = async (payload?: number) => {
  try {
    const response: AxiosResponse<ICollections> = await axios.get(
      `/kiot/categories/${payload}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            EAuthToken.KIOT_TOKEN
          )}`,
          Retailer: "thanhthuy1988",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
