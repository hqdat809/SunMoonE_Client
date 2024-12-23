import axios, { AxiosResponse } from "axios";
import { IKiotResponse } from "../interfaces/common";
import { IProductResponse } from "../interfaces/product-interface";
import { EAuthToken } from "../interfaces/user-interfaces";
import { IOrder, IOrderRequest } from "../interfaces/order-interface";

export const createOrder = async (
    payload?: any,
    cb?: () => void
) => {
    try {
        const params = new URLSearchParams(payload as Record<string, string>);
        const response: AxiosResponse<IKiotResponse<IProductResponse[]>> =
            await axios.post(`/kiot/orders`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        EAuthToken.KIOT_TOKEN
                    )}`,
                    Retailer: "thanhthuy1988",
                },
            });

        if (response.status === 200) {
            cb?.();
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};

export const cancelOrder = async (
    payload?: number,
    cb?: () => void
) => {
    try {
        const response: AxiosResponse<IKiotResponse<IProductResponse[]>> =
            await axios.delete(`/kiot/orders/${payload}?IsVoidPayment=true`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        EAuthToken.KIOT_TOKEN
                    )}`,
                    Retailer: "thanhthuy1988",
                },
            });

        if (response.status === 200) {
            cb?.();
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};

export const getListOrder = async (
    payload?: IOrderRequest,
    cb?: () => void
) => {
    try {
        const params = new URLSearchParams(payload as Record<string, string>);
        const response: AxiosResponse<IKiotResponse<IOrder[]>> = await axios.get(
            `/kiot/orders?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        EAuthToken.KIOT_TOKEN
                    )}`,
                    Retailer: "thanhthuy1988",
                },
            }
        );

        if (response.status === 200) {
            cb?.();
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};


export const getOrderDetails = async (
    payload?: string,
    cb?: () => void
) => {
    try {
        const response: AxiosResponse<IOrder> = await axios.get(
            `/kiot/orders/${payload}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        EAuthToken.KIOT_TOKEN
                    )}`,
                    Retailer: "thanhthuy1988",
                },
            }
        );

        if (response.status === 200) {
            cb?.();
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};