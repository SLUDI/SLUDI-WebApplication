import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  creteOrganization,
  allOrganization,
  createTemplate,
  allTemplate,
  approveOrganizationOrg,
  suspendOrganizationOrg,
  reactivateOrganizationOrg,
} from "../services/organization/organization";

// Register Mutation
export const useOrganizationCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: creteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries(["organization"]);
    },
  });
};

export const useAllOrganization = () => {
  return useQuery({
    queryKey: ["organization"],
    queryFn: allOrganization,
  });
};

export const useTemplateCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(["organizationTemplate"]);
    },
  });
};

export const useAllTemplate = () => {
  return useQuery({
    queryKey: ["organizationTemplate"],
    queryFn: allTemplate,
  });
};

//aprove
export const useApproveOrg = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => approveOrganizationOrg(userId),
    onSuccess: () => qc.invalidateQueries(["organization"]),
  });
};

export const useSuspendOrg = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }) => suspendOrganizationOrg(userId, reason),
    onSuccess: () => qc.invalidateQueries(["organization"]),
  });
};

export const useReactivateOrg = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => reactivateOrganizationOrg(userId),
    onSuccess: () => qc.invalidateQueries(["organization"]),
  });
};
