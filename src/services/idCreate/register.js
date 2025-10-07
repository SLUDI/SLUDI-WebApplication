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
    divisionalSecretariat: data.divisionalSecretariat, // ✅ corrected spelling
    gramaNiladhariDivision: data.gramaNiladhariDivision,
    province: data.province,
    date1: data.dateOfBirth,
    date2: data.dateOfBirth,
    date3: data.dateOfBirth,
    deviceType: data.deviceType, // ✅ corrected
    deviceId: data.deviceId,
    os: data.os,
    ipAddress: data.ipAddress,
    location: data.location, // ✅ corrected
  };

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
        // add arrays correctly
        searchParams.append("documentTypes", "NIC");
        searchParams.append("documentTypes", "NIC");
        searchParams.append("documentTypes", "birthCertificate");
        searchParams.append("documentTypes", "birthCertificate");
        searchParams.append("documentSides", "Front");
        searchParams.append("documentSides", "Back");
        searchParams.append("documentSides", "Front");
        searchParams.append("documentSides", "Back");
        return searchParams.toString();
      },
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export default { registerUser, registerCitizen };
