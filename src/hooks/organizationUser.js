import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  allOrganizationUsers,
  approveOrganizationUser,
  createOrganizationUser,
  getOrganizationCount,
  getOrganizationRoles,
  reactivateOrganizationUser,
  suspendOrganizationUser,
} from "../services/organizationUser/organizationUser";

// Create Organization User Mutation
export const useOrganizationUserCreate = () => {
  return useMutation({
    mutationFn: createOrganizationUser,
    onSuccess: () => qc.invalidateQueries(["organizationUser"]),
  });
};

// Get Organization Roles Query
export const useOrganizationRoles = (organizationId) => {
  return useQuery({
    queryKey: ["organizationRoles", organizationId],
    queryFn: () => getOrganizationRoles(organizationId),
    enabled: !!organizationId, // Only run query if organizationId exists
  });
};

//Get All Organization

export const useAllOrganizationUsers = (organizationId, status) => {
  return useQuery({
    queryKey: ["organizationUser", organizationId, status],
    queryFn: () =>
      allOrganizationUsers(
        organizationId,
        status !== "NOT_FILTER" ? status : null
      ),
    enabled: !!organizationId,
  });
};

//Get All Counts

export const useOrganizationCount = (organizationId) => {
  return useQuery({
    queryKey: ["organizationCount", organizationId],
    queryFn: () => getOrganizationCount(organizationId),
    enabled: !!organizationId, // Only run query if organizationId exists
  });
};

//aprove
export const useApproveUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => approveOrganizationUser(userId),
    onSuccess: () => qc.invalidateQueries(["organizationUser"]),
  });
};

export const useSuspendUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }) => suspendOrganizationUser(userId, reason),
    onSuccess: () => qc.invalidateQueries(["organizationUser"]),
  });
};

export const useReactivateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => reactivateOrganizationUser(userId),
    onSuccess: () => qc.invalidateQueries(["organizationUser"]),
  });
};
