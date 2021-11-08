import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastifyNotification = (params) => {

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
    />
  )
}

export {
  ToastifyNotification,
  toast
}