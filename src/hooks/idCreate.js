import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  registerUser,
  registerCitizen,
  dateAvailability,
  saveBiometricData,
  generateCredential,
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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: appoinmentConfirm,
    onSuccess: () => qc.invalidateQueries(["idVerification"]),
  });
};

export const useSaveBiometricData = () => {
  return useMutation({
    mutationFn: saveBiometricData,
  });
};

export const useGenerateCredential = () => {
  return useMutation({
    mutationFn: (did) => generateCredential(did),
  });
};

// export const useApproveUser = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (userId) => approveOrganizationUser(userId),
//     onSuccess: () => qc.invalidateQueries(["organizationUser"]),
//   });
// };

// //aprove
// export const useApproveUser = () => {
//   return useMutation({
//     mutationFn: (did) => generateCredential(did),
//   });
// };
