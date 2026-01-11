import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

export const registerUser = async (data) => {
  const response = await axiosInstance.post(endpoints.REGISTER, data);
  return response.data;
};

export const registerCitizen = async (data) => {
  const formData = new FormData();

  if (data.supportingDocuments && data.supportingDocuments.length > 0) {
    data.supportingDocuments.forEach((file) => {
      formData.append("supportingDocuments", file);
    });
  }

  if (data.profilePhoto) {
    formData.append("profilePhoto", data.profilePhoto);
  }

  const params = {
    fullName: data.fullName,
    age: data.age,
    nic: data.nic,
    dateOfBirth: data.dateOfBirth,
    citizenship: data.citizenship,
    gender: data.gender,
    nationality: data.nationality,
    bloodGroup: data.bloodGroup,
    email: data.email,
    phone: data.phone,
    street: data.street,
    city: data.city,
    district: data.selectDistrict,
    postalCode: data.postalCode,
    divisionalSecretariat: data.divisionalSecretariat,
    gramaNiladhariDivision: data.gramaNiladhariDivision,
    province: data.province,
    selectDate: data.selectDate,

    deviceType: data.deviceType,
    deviceId: data.deviceId,
    os: data.os,
    ipAddress: data.ipAddress,
    location: data.location,
  };

  //console.log("🧾 Params to be sent:", params);
  // console.log("📎 Files in FormData:");
  // for (let pair of formData.entries()) {
  //   console.log(pair[0] + ":", pair[1]);
  // }

  const response = await axiosInstance.post(
    endpoints.CITIZEN_REGISTER,
    formData,
    {
      params,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();

        for (const key in params) {
          if (Array.isArray(params[key])) {
            params[key].forEach((val) => searchParams.append(key, val));
          } else {
            searchParams.append(key, params[key]);
          }
        }

        const documentTypes = [
          "NIC",
          "NIC",
          "BirthCertificate",
          "BirthCertificate",
        ];
        const documentSides = ["Front", "Back", "Front", "Back"];

        documentTypes.forEach((type) =>
          searchParams.append("documentTypes", type)
        );
        documentSides.forEach((side) =>
          searchParams.append("documentSides", side)
        );

        return searchParams.toString();
      },
    }
  );

  return response.data;
};

export const dateAvailability = async ({ district, daysAhead = 30 }) => {
  const response = await axiosInstance.get(`${endpoints.DATE_AVAILABILITY}`, {
    params: {
      district,
      daysAhead,
    },
  });
  return response.data;
};

export const saveBiometricData = async (data) => {
  const response = await axiosInstance.post(
    endpoints.SAVE_BIOMETRIC_DATA,
    data
  );
  return response.data;
};

// export const generateCredential = async (did) => {
//   const response = await axiosInstance.post(
//     `${endpoints.CREDENTIAL}?did=${did}`
//   );
//   return response.data;
// };

export const generateCredential = async (did) => {
  const response = await axiosInstance.post(`${endpoints.CREDENTIAL}/${did}`);
  return response.data;
};

// export const approveOrganizationUser = async (userId) => {
//   const res = await axiosInstance.post(
//     `${endpoints.ORGNIZATION_USER}/${userId}/approve`
//   );
//   return res.data;
// };

export const faceVerification = async (data) => {
  const response = await axiosInstance.post(
    endpoints.FACE_VERIFICATION,
    data
  );
  return response.data;
};

export default {
  registerUser,
  registerCitizen,
  dateAvailability,
  saveBiometricData,
  generateCredential,
  faceVerification,
};
