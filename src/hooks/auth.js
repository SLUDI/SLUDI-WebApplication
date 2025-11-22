import { login } from "../services/auth/auth";
import { useMutation } from "@tanstack/react-query";

export const authLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};
