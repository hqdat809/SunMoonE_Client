import { ETimeRange } from "../interfaces/common";

export const formatDate = (timestamp: string, getHours?: boolean) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return getHours
    ? `${day}/${month}/${year} ${hours}:${minutes}`
    : `${day}/${month}/${year}`;
};
