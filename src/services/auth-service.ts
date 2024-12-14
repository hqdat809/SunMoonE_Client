import axios, { AxiosResponse } from "axios";
import { FormikHelpers } from "formik";
import {
  EUserTypeCategory,
  TRegisterRequest,
  TSignInRequest,
  TSignInResponse,
} from "../interfaces/user-interfaces";
import { toastError, toastSuccess } from "../utils/notifications-utils";
import { saveStorageToken } from "../utils/storage-utils";
import { ApiClient } from "./api-clients";
import { getProducts } from "./product-service";
import { createCustomer } from "./customer-service";
// import Cookies from "universal-cookie";



export const signIn = async (payload: TSignInRequest, cb?: () => void) => {
  try {
    const response: AxiosResponse<TSignInResponse> = await axios.post(
      `/api/v1/auth/authenticate`,
      payload
    );

    if (response.status === 200) {
      saveStorageToken(response.data.token);

      console.log("login: ", response.data.userDetails)
      localStorage.setItem(
        "userDetails",
        JSON.stringify(response.data.userDetails)
      );
      switch (response.data.userDetails.authorities[0].authority) {
        case EUserTypeCategory.USER:
        case EUserTypeCategory.ADMIN: {
          localStorage.setItem(
            "CategoryParentId",
            JSON.stringify(import.meta.env.VITE_COLLECTION_USER_ID)
          );
          break;
        }
        case EUserTypeCategory.CUSTOMER: {
          localStorage.setItem(
            "CategoryParentId",
            JSON.stringify(import.meta.env.VITE_COLLECTION_CUSTOMER_ID)
          );
          break;
        }
        case EUserTypeCategory.CTV1: {
          localStorage.setItem(
            "CategoryParentId",
            JSON.stringify(import.meta.env.VITE_COLLECTION_CTV1_ID)
          );
          break;
        }
        case EUserTypeCategory.CTV2: {
          localStorage.setItem(
            "CategoryParentId",
            JSON.stringify(import.meta.env.VITE_COLLECTION_CTV2_ID)
          );
          break;
        }
        case EUserTypeCategory.CTV3: {
          localStorage.setItem(
            "CategoryParentId",
            JSON.stringify(import.meta.env.VITE_COLLECTION_CTV3_ID)
          );
          break;
        }
        default: {
          break;
        }
      }
      await cb?.();
      await getTokenFromKiotViet()
      await getProducts({
        pageSize: 200,
        orderBy: "name",
        orderDirection: "ASC",
        categoryId: import.meta.env.VITE_COLLECTION_USER_ID,
        currentItem: 0,
      }).then((res) => {
        localStorage.setItem("products", JSON.stringify(res?.data))
      }
      );
      localStorage.removeItem("productInCart");
    }

    return response.data;
  } catch (error: any) {
    if (error.status === 401) {
      toastError("Email hoặc mật khẩu không đúng!!");
    } else {
      toastError(error.message);
    }
  }
};

export const register = async (
  payload: TRegisterRequest,
  // cb?: (value?: string) => void,
  cbe?: FormikHelpers<any>
) => {
  try {

    const customerData = {
      name: payload.firstName + payload.lastName,
      email: payload.email,
      phone: payload.phone,
      branchId: 1000000900
    }

    // const createdCustomerResponse = await createCustomer(customerData)

    // if (!createdCustomerResponse) {
    //   throw new Error("Customer not created")
    // }

    // const registerValues = { ...payload, role: "USER", customerId: createdCustomerResponse.data.id };


    const response: AxiosResponse<TSignInResponse> = await ApiClient.post(
      `/api/v1/auth/register`,
      payload
    );

    if (response.status === 200) {
      saveStorageToken(response.data.token);
      // cb?.(payload.email);
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

export const checkSession = async (cb?: () => void) => {
  try {
    const response: AxiosResponse<TSignInResponse> = await ApiClient.get(
      `/api/v1/session`
    );
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
