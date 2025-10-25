import { useMutation, useQuery } from "@tanstack/react-query";
import {
  registerUser,
  registerCitizen,
  dateAvailability,
} from "../services/idCreate/register";
import {
  idverification,
  appoinmentConfirm,
} from "../services/idVerification/idVerification";

// Register Mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useCitizenRegister = () => {
  return useMutation({
    mutationFn: registerCitizen,
  });
};

//citizen useres details

export const useIdVerification = () => {
  return useQuery({
    queryKey: ["idVerification"],
    queryFn: idverification,
  });
};

export const useDateAvailability = () => {
  return useMutation({
    mutationFn: dateAvailability,
  });
};

export const useAppoinment = () => {
  return useMutation({
    mutationFn: appoinmentConfirm,
  });
};
