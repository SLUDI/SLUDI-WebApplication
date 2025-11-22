import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

// Create Organization User
export const createOrganizationUser = async (data) => {
  const response = await axiosInstance.post(
    endpoints.CREATE_ORGANIZATION_USER,
    data
  );
  return response.data;
};

// Get Organization Roles
export const getOrganizationRoles = async (organizationId) => {
  const response = await axiosInstance.get(
    `${endpoints.ORGNIZATION_ROLE}/${organizationId}/roles`
  );
  return response.data;
};

//Get All organization

export const allOrganizationUsers = async (organizationId, status) => {
  const url = status
    ? `${endpoints.GET_ALL_ORGANIZATION_USERS}/${organizationId}?status=${status}`
    : `${endpoints.GET_ALL_ORGANIZATION_USERS}/${organizationId}`;

  const res = await axiosInstance.get(url);
  return res.data;
};

// Get Organization count
export const getOrganizationCount = async (organizationId) => {
  const response = await axiosInstance.get(
    `${endpoints.ORGNIZATION_COUNT}/${organizationId}/statistics`
  );
  return response.data;
};

//aprove
export const approveOrganizationUser = async (userId) => {
  const res = await axiosInstance.post(
    `${endpoints.ORGNIZATION_USER}/${userId}/approve`
  );
  return res.data;
};

// Suspend user
export const suspendOrganizationUser = async (userId, reason) => {
  return axiosInstance.post(
    `api/organization-users/${userId}/suspend?reason=${reason}`
  );
};

// Reactivate user
export const reactivateOrganizationUser = async (userId) => {
  return axiosInstance.post(`api/organization-users/${userId}/reactivate`);
};

export default {
  createOrganizationUser,
  getOrganizationRoles,
  allOrganizationUsers,
  getOrganizationCount,
  approveOrganizationUser,
  suspendOrganizationUser,
  reactivateOrganizationUser,
};
