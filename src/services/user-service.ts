import axios, { AxiosResponse } from "axios";
import { IUserAddress, IUserBank, IUserData, TUserDetails } from "../interfaces/user-interfaces";
import { ApiClient } from "./api-clients";

export const getUserById = async (userId: string, cb?: () => void) => {
    const response: AxiosResponse<TUserDetails> = await ApiClient.get(
        `/api/v1/user/profile/${userId}`
    );

    if (response.status === 200) {
        cb?.();
    }

    return response;
};


export const updateUserBank = async (userId: string, userBank: IUserBank, cb?: () => void) => {
    const response: AxiosResponse<TUserDetails> = await ApiClient.post(
        `/api/v1/user-bank/${userId}`, userBank
    );

    if (response.status === 200) {
        cb?.();
    }

    return response;
};

export const updateUserAddress = async (userId: string, userAddress: IUserAddress, cb?: () => void) => {
    const response: AxiosResponse<IUserAddress> = await ApiClient.post(
        `/api/v1/user-address/${userId}`, userAddress
    );

    if (response.status === 200) {
        cb?.();
    }

    return response;
};

export const getUserAddress = async (userId: string, cb?: () => void) => {
    const response: AxiosResponse<IUserAddress> = await ApiClient.get(
        `/api/v1/user-address/${userId}`
    );

    if (response.status === 200) {
        cb?.();
    }

    return response;
};

export const changePassword = async (userId: string, newPassword: string, oldPassword: string, cb?: () => void) => {

    const payload = { newPassword, oldPassword }

    const response: AxiosResponse<IUserAddress> = await ApiClient.put(
        `/api/v1/user/change-password/${userId}`, payload
    );

    if (response.status === 200) {
        cb?.();
    }

    return response;
};



