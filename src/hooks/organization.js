import { useMutation, useQuery } from "@tanstack/react-query";
import {
  creteOrganization,
  allOrganization,
  createTemplate,
} from "../services/organization/organization";

// Register Mutation
export const organizationCreate = () => {
  return useMutation({
    mutationFn: creteOrganization,
  });
};

export const useAllOrganization = () => {
  return useQuery({
    queryKey: ["organization"],
    queryFn: allOrganization,
  });
};

export const templateCreate = () => {
  return useMutation({
    mutationFn: createTemplate,
  });
};
