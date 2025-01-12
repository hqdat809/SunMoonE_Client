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
    } catch (error: any) {
        throw new Error(error.response.data.responseStatus.message)
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

export const getAllLocations = async () => {
    try {

        const totalItems = 800; // Tổng số item
        const itemsPerPage = 200; // Số item mỗi lần gọi API
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Tổng số lần gọi API

        // Tạo danh sách các promise cho từng lần gọi API
        const requests = Array.from({ length: totalPages }, async (_, i) => {
            const offset = i * itemsPerPage;
            return axios.get(
                `/kiot/locations?pageSize=${itemsPerPage}&currentItem=${offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            EAuthToken.KIOT_TOKEN
                        )}`,
                        Retailer: "thanhthuy1988",
                    },
                }
            )
        });

        // Thực hiện tất cả các promise
        const results = await Promise.all(requests);

        // Lấy kết quả từ tất cả các promise
        const locations = results.flatMap((response) => response.data.data);

        console.log("locations: ", locations);

        // Gộp kết quả từ tất cả các promise
        return locations;
    } catch (error) {
        console.error("Error:", error);
    }
}