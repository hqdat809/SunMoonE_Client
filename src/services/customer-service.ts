import axios, { AxiosResponse } from "axios";
import { EAuthToken } from "../interfaces/user-interfaces";
import { ICollections } from "../interfaces/collection-interface";
import {
  TCreateCustomer,
  TUpdateCustomer,
} from "../interfaces/customer-interface";
import { ApiClient } from "./api-clients";
import { getAppBarUtilityClass } from "@mui/material";

export const createCustomer = async () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "");

  const customerData = {
    name: `${userDetails.firstName} ${userDetails.lastName}`,
    email: userDetails.email,
    phone: userDetails.phone,
    branchId: 286368,
  };

  if (!userDetails) {
    throw new Error("Can not found user details");
  }

  const token = `Bearer ${localStorage.getItem(EAuthToken.KIOT_TOKEN)}`;

  try {
    const response: AxiosResponse<any> = await axios.post(
      `/kiot/customers`,
      customerData,
      {
        headers: {
          Authorization: token,
          Retailer: "thanhthuy1988",
        },
      }
    );

    const user = await ApiClient.put(
      `/api/v1/user/update-customer-id/${userDetails.id}?customerId=${response.data.data.id}`
    );

    localStorage.setItem("userDetails", JSON.stringify(user.data));

    return user.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getCustomerById = async (payload?: TCreateCustomer) => {
  const token = `Bearer ${localStorage.getItem(EAuthToken.KIOT_TOKEN)}`;

  try {
    const response: AxiosResponse<any> = await axios.post(
      `/kiot/customers`,
      payload,
      {
        headers: {
          Authorization: token,
          Retailer: "thanhthuy1988",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateCustomerAddress = async (
  customerId: number,
  payload?: TUpdateCustomer
) => {
  const token = `Bearer ${localStorage.getItem(EAuthToken.KIOT_TOKEN)}`;

  try {
    const response: AxiosResponse<any> = await axios.put(
      `/kiot/customers/${customerId}`,
      payload,
      {
        headers: {
          Authorization: token,
          Retailer: "thanhthuy1988",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
