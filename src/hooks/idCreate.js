import { useMutation } from "@tanstack/react-query";
import { registerUser, registerCitizen } from "../services/idCreate/register";

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
