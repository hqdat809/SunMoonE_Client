import axios, { AxiosResponse } from "axios";
import { EAuthToken } from "../interfaces/user-interfaces";
import { ICollections } from "../interfaces/collection-interface";
import { TCreateCustomer } from "../interfaces/customer-interface";

export const createCustomer = async (payload?: TCreateCustomer) => {

    const token = `Bearer ${localStorage.getItem(
        EAuthToken.KIOT_TOKEN
    )}`

    try {
        const response: AxiosResponse<any> = await axios.post(
            `/kiot/customers`, payload,
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

export const getCustomerById = async (payload?: TCreateCustomer) => {

    const token = `Bearer ${localStorage.getItem(
        EAuthToken.KIOT_TOKEN
    )}`

    try {
        const response: AxiosResponse<any> = await axios.post(
            `/kiot/customers`, payload,
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