import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toaster = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName={() =>
        "relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer backdrop-blur-lg bg-purple-900/80 border border-white/10 mb-4"
      }
      bodyClassName={() => "text-sm text-white block p-3"}
      progressClassName={() =>
        "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
      }
    />
  );
};

export const showToast = {
  success: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
    });
  },
  error: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
    });
  },
  warning: (message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
    });
  },
  info: (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 4000,
    });
  },
  loading: (message) => {
    return toast.loading(message, {
      position: "top-right",
    });
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  update: (toastId, message, type = "success") => {
    toast.update(toastId, {
      render: message,
      type,
      isLoading: false,
      autoClose: 3000,
    });
  },
};

export default Toaster;
