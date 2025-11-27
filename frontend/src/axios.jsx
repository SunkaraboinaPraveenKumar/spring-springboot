import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090/api",
  validateStatus: function (status) {
    // Accept all status codes, don't throw error for 3xx
    return status >= 200 && status < 500;
  }
});

export default API;
