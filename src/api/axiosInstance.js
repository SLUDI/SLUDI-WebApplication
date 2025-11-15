import axios from "axios";
import { getLocalStorageData } from "../utils/localStorageHelper";

const baseUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  //timeout: 30000, // 30 seconds timeout
  headers: {
    //"ngrok-skip-browser-warning": "true",
    //type: "web",
  },
});

// ✅ Optional: interceptors for token handling
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorageData("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
