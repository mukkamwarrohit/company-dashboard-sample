import { notification } from "antd";

export const showNotification = (
  type: "success" | "error" | "info",
  message: string,
  description?: string
) => {
  notification[type]({
    message,
    description,
    placement: "topRight",
  });
};
