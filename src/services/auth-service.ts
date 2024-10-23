import axios, { AxiosResponse } from "axios";
import { FormikHelpers } from "formik";
import {
  TRegisterRequest,
  TSignInRequest,
  TSignInResponse,
} from "../interfaces/user-interfaces";
import { toastError, toastSuccess } from "../utils/notifications-utils";
import { saveStorageToken } from "../utils/storage-utils";
import { ApiClient } from "./api-clients";

export const signIn = async (payload: TSignInRequest, cb?: () => void) => {
  try {
    console.log("signIn", payload);

    const response: AxiosResponse<TSignInResponse> = await ApiClient.post(
      `/api/v1/auth/authenticate`,
      payload
    );

    if (response.status === 200) {
      saveStorageToken(response.data.token);
      cb?.();
    }

    return response.data;
  } catch (error: any) {
    console.log(error);
    if (error.status === 401) {
      toastError("Email hoặc mật khẩu không đúng!!");
    } else {
      toastError(error.message);
    }
  }
};

export const register = async (
  payload: TRegisterRequest,
  cb?: (value?: string) => void,
  cbe?: FormikHelpers<any>
) => {
  try {
    const registerValues = { ...payload, role: "USER" };

    const response: AxiosResponse<TSignInResponse> = await ApiClient.post(
      `/api/v1/auth/register`,
      registerValues
    );

    if (response.status === 200) {
      saveStorageToken(response.data.token);
      cb?.(registerValues.email);
    }

    return response.data;
  } catch (error: any) {
    if (
      error.response.data.message.includes("@") &&
      error.response.data.message.includes("Duplicate")
    ) {
      toastError("Email " + payload.email + " này đã được sử dụng!!");
      cbe?.setFieldError("email", "Email này đã được sử dụng!");
    } else if (error.response.data.message.includes("Duplicate")) {
      cbe?.setFieldError("phone", "Số điện thoại này đã được sử dụng!");
      toastError("Số điện thoại " + payload.phone + " này đã được sử dụng!!");
    } else {
      toastError(error.message);
    }
    Promise.reject(error);
  }
};

export const sendOTP = async (payload: string, cb?: () => void) => {
  try {
    const response: AxiosResponse<TSignInResponse> = await ApiClient.get(
      `/api/v1/auth/send-otp?email=${payload}`
    );

    if (response.status === 200) {
      cb?.();
      toastSuccess("Đã gửi OTP thành công!!");
    }

    return response.data;
  } catch (error: any) {
    toastError(error.message);
  }
};

export const verifyEmail = async (
  payload: { email: string; otp: string },
  cb?: () => void
) => {
  try {
    const response: AxiosResponse<string> = await ApiClient.get(
      `/api/v1/auth/verify-email?email=${payload.email}&otp=${payload.otp}`
    );

    if (response.status === 200) {
      cb?.();
    }
    toastSuccess(response.data);
    return response.data;
  } catch (error: any) {
    toastError(error.response.data);
  }
};

export const getTokenFromKiotViet = async () => {
  const data = {
    scopes: "PublicApi.Access",
    grant_type: "client_credentials",
    client_id: import.meta.env.VITE_CLIENT_ID,
    client_secret: import.meta.env.VITE_CLIENT_SECRET,
  };

  try {
    const response = await axios.post("/token", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    localStorage.setItem("KIOT_TOKEN", response.data.access_token);
  } catch (error: any) {
    toastError(
      error.message ||
        "Lấy token của KiotViet không thành công! Hãy thử đăng nhập lại hoặc liên hệ với admin"
    );
  }
};
