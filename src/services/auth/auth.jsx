import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

export const login = async (data) => {
  const response = await axiosInstance.post(endpoints.LOGIN, data);
  return response.data;
};

export default { login };
