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

export const allTemplate = async () => {
  const response = await axiosInstance.get(`${endpoints.GEt_ALL_TEMPLATE}`);
  return response.data;
};

//aprove
export const approveOrganizationOrg = async (userId) => {
  const res = await axiosInstance.put(
    `${endpoints.ORGNIZATION_ORG}/approve/${userId}`
  );
  return res.data;
};

// Suspend user
// Suspend user
export const suspendOrganizationOrg = async (userId, reason) => {
  return axiosInstance.put(`${endpoints.ORGNIZATION_ORG}/${userId}/suspend`, {
    reason: reason,
  });
};

// Reactivate user
export const reactivateOrganizationOrg = async (userId) => {
  return axiosInstance.put(`${endpoints.ORGNIZATION_ORG}/${userId}/reactivate`);
};

export default {
  creteOrganization,
  allOrganization,
  createTemplate,
  allTemplate,
  approveOrganizationOrg,
  suspendOrganizationOrg,
  reactivateOrganizationOrg,
};
