import axios, { AxiosResponse } from "axios";
import { toastError } from "../utils/notifications-utils";

export const getProvinces = async (cb?: () => void) => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `https://provinces.open-api.vn/api/?depth=3`
    );
    if (response.status === 200) {
      cb?.();
    }
    return response.data;
  } catch (error: any) {
    if (error.status === 429) {
      toastError(
        "Lấy dánh sách tỉnh thành không thành công!! Vui lòng đợi 30s và tải lại trang!!"
      );
    }
    console.error("Error:", error);
  }
};

export const getDistricts = async (provinceCode: number, cb?: () => void) => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
    );
    return response.data;
  } catch (error: any) {
    cb?.();
    if (error.status === 429) {
      toastError("Bạn đã nhập quá nhiều lần, vui lòng đợi 30s và chọn lại!!");
    }
    console.error("Error:", error);
  }
};

export const getWards = async (districtCode: number, cb?: () => void) => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
    );

    return response.data;
  } catch (error: any) {
    cb?.();
    if (error.status === 429) {
      toastError("Bạn đã nhập quá nhiều lần, vui lòng đợi 30s và chọn lại!!");
    }
    console.error("Error:", error);
  }
};
