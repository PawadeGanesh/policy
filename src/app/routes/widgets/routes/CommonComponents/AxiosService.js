import axios from "axios";
import { useSelector } from "react-redux";

const config = {
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  data: {},
};

// const { authUser } = useSelector(({ auth }) => auth);

class Service {
  constructor() {
    let service = axios.create({
      config,
    });
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  handleSuccess(response) {
    return response;
  }

  handleError = (error) => {
    switch (error.response.status) {
      case 401:
        this.redirectTo(document, "/");
        break;
      case 404:
        this.redirectTo(document, "/404");
        break;
      default:
        this.redirectTo(document, "/500");
        break;
    }
    return Promise.reject(error);
  };

  redirectTo = (document, path) => {
    document.location = path;
  };

  async get(path, params, callback) {
    const response = await this.service.get(path, params);
    return callback(response.status, response.data);
  }

  async patch(path, payload, callback) {
    const response = await this.service.request({
      method: "PATCH",
      url: path,
      responseType: "json",
      data: payload,
    });
    return callback(response.status, response.data);
  }

  async post(path, payload, callback) {
    const response = await this.service.request({
      method: "POST",
      url: path,
      responseType: "json",
      data: payload,
    });
    return callback(response.status, response.data);
  }
}

export default new Service();
