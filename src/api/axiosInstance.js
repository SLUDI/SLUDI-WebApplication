import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000, // 10 seconds timeout
  // headers: {
  //   "Content-Type": "application/json",
  //   type: "web",
  // },
});

// ✅ Optional: interceptors for token handling
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
