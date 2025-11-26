/** @jsxImportSource react */
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

const useNotification = () => {
  const notifySuccess = (message, options = {}) => {
    toast.success(message, {
      //icon: <FiCheckCircle className="w-[24px] h-[24px]" />,
      toastId: "success",
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  };

  const notifyError = (message, options = {}) => {
    toast.error(message, {
      // icon: <FiAlertCircle className="w-[24px] h-[24px]" />,
      toastId: "error",
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  };

  const notifyInfo = (message, options = {}) => {
    toast.info(message, {
      // icon: <FiInfo className="w-[24px] h-[24px]" />,
      toastId: "info",
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  };

  const notifyWarning = (message, options = {}) => {
    toast.warning(message, {
      // icon: <FiAlertCircle className="w-[24px] h-[24px]" />,
      toastId: "warning",
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
};

export default useNotification;
