import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IPPNotification = (props) => {

 

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      {...props}
    />
  )
}

 //Error Message
 let emptyErrorMessage = "Server Error,Please Try Again!";

let ippNotify = {
  success: (msg, options = undefined) => {
    toast.success(msg || '', options);
  },
  info: (msg, options = undefined) => {
    toast.info(msg || '', options);
  },
  error: (msg, options = undefined) => {
    toast.error(msg || emptyErrorMessage, options);
  },
  warning: (msg, options = undefined) => {
    toast.warning(msg || '', options);
  },
  dark: (msg, options = undefined) => {
    toast.dark(msg || '', options);
  },
}

export {
  IPPNotification,
  ippNotify
}