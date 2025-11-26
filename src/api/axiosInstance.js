import axios from "axios";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "../utils/localStorageHelper";

const baseUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {},
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async () => {
  const refreshToken = getLocalStorageData("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(
      `${baseUrl}/api/organization-users/auth/refresh`,
      { refreshToken }
    );

    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    } = response.data.data;

    // Update tokens in localStorage
    setLocalStorageData("token", accessToken);
    setLocalStorageData("refreshToken", newRefreshToken);
    setLocalStorageData("expiresIn", expiresIn);

    // Calculate and store token expiry time (expiresIn is already in milliseconds)
    const expiryTime = Date.now() + expiresIn;
    setLocalStorageData("tokenExpiryTime", expiryTime);

    return accessToken;
  } catch (error) {
    // Clear tokens on refresh failure
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("tokenExpiryTime");

    // Redirect to login
    window.location.href = "/login";
    throw error;
  }
};

// Request interceptor - Add token to headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getLocalStorageData("token");
    const tokenExpiryTime = getLocalStorageData("tokenExpiryTime");
    const currentTime = Date.now();

    // Check if token is about to expire (5 minutes buffer)
    if (tokenExpiryTime && currentTime >= tokenExpiryTime - 5 * 60 * 1000) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          processQueue(null, newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          isRefreshing = false;
          processQueue(error, null);
          return Promise.reject(error);
        }
      } else {
        // Wait for token refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          })
          .catch((err) => Promise.reject(err));
      }
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle Content-Type
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 errors and Notifications
axiosInstance.interceptors.response.use(
  (response) => {
    // Show success notification

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
