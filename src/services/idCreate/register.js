import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

export const registerUser = async (data) => {
  const response = await axiosInstance.post(endpoints.REGISTER, data);
  return response.data;
};

export const registerCitizen = async (data) => {
  const formData = new FormData();

  // append all supporting documents
  if (data.supportingDocuments && data.supportingDocuments.length > 0) {
    data.supportingDocuments.forEach((file) => {
      formData.append("supportingDocuments", file);
    });
  }

  // params (all non-file fields)
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
    district: data.district,
    postalCode: data.postalCode,
    divisionSecretariat: data.divisionSecretariat,
    gramaNiladhariDivision: data.gramaNiladhariDivision,
    province: data.province,
    deviceId: data.deviceId,
    os: data.os,
    ipAddress: data.ipAddress,
    location: data.location,
    documentTypes: data.documentTypes,
    documentSides: data.documentSides,
  };

  const response = await axiosInstance.post(
    endpoints.CITIZEN_REGISTER,
    formData,
    {
      params,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export default { registerUser, registerCitizen };
