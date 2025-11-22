import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLicense,
  getLicense,
  getVehicleCategories,
  requestLicense,
} from "../services/licenseIssued/licenseIssued";

export const useLicenseRequest = () => {
  return useMutation({
    mutationFn: requestLicense,
  });
};

export const useVehicleCategories = () => {
  return useQuery({
    queryKey: ["vehicle-categories"],
    queryFn: getVehicleCategories,
  });
};

export const useLicenseCreate = () => {
  return useMutation({
    mutationFn: createLicense,
  });
};

export const useGetAllLicenses = () => {
  return useQuery({
    queryKey: ["all-licenses"],
    queryFn: getLicense,
  });
};
