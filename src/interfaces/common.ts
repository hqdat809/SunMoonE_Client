export interface IKiotResponse<T> {
  total: number;
  pageSize: number;
  data: T;
  timestamp: Date;
}

export interface ISelectOptions {
  value: string | number;
  label: string;
}

export interface IShopResponse {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  facebookAddress: string;
  youtubeAddress: string;
}

export interface IBankResponse {
  id: string;
  name: string;
  bankId: string;
  fullName: string;
}

export enum ETimeRange {
  TODAY = "TODAY",
  THIS_WEEK = "THIS_WEEK",
  THIS_MONTH = "THIS_MONTH",
  THIS_YEAR = "THIS_YEAR",
}
