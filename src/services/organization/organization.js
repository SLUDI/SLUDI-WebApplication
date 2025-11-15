import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

export const creteOrganization = async (data) => {
  const response = await axiosInstance.post(
    endpoints.CREATE_ORGANIZATION,
    data
  );
  return response.data;
};

export const allOrganization = async () => {
  const response = await axiosInstance.get(`${endpoints.GET_ALL_ORGANIZATION}`);
  return response.data;
};

export const createTemplate = async (data) => {
  const response = await axiosInstance.post(endpoints.CREATE_TEMPLATE, data);
  return response.data;
};

export default { creteOrganization, allOrganization, createTemplate };
