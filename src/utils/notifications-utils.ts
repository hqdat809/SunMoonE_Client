import { notification } from "antd";

const toastError = (message: string, title = "Lỗi!") => {
  notification.error({
    message: title,
    description: message,
  });
};

const toastInfo = (message: string, title = "Thông tin") => {
  notification.info({
    message: title,
    description: message,
  });
};

const toastSuccess = (message: string, title = "Thành công!") => {
  notification.success({
    message: title,
    description: message,
  });
};

export { toastError, toastSuccess, toastInfo };
