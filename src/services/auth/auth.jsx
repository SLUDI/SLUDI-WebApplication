import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

export const login = async (data) => {
  const response = await axiosInstance.post(endpoints.LOGIN, data);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Login failed");
  }
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post(
    "/api/organization-users/auth/refresh",
    { refreshToken }
  );
  return response.data;
};

export default { login, refreshToken };
