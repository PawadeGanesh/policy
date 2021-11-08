/* eslint-disable no-undef */
import axios from "axios";
import apiInstance from "./index";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

//Get Method
const apigetUrl = async (url) => {
  let geturl = baseURL + url;
  return axios
    .get(geturl, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("user_id")}`,
      },
      data: {},
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
};

//Post Method
const apipostUrl = async (url, postObj) => {
  let geturl = baseURL + url;
  return axios
    .post(geturl, postObj, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("user_id")}`,
      },
      data: {},
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
};

//Put Method
const apiputUrl = async (url, postObj) => {
  let geturl = baseURL + url;
  return axios
    .put(geturl, postObj, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("user_id")}`,
      },
      data: {},
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
};

//Delete Method
const apideleteUrl = async (url) => {
  let geturl = baseURL + url;
  return axios
    .delete(geturl, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("user_id")}`,
      },
      data: {},
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
};
export { apigetUrl, apipostUrl, apiputUrl, apideleteUrl };
