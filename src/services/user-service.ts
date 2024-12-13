import { AxiosResponse } from "axios";
import { IUserBank, IUserData, TUserDetails } from "../interfaces/user-interfaces";
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


