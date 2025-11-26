import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

export const requestLicense = async () => {
  const response = await axiosInstance.post(endpoints.LICENSE_ISSUED);
  return response.data;
};

export const checkLicenseStatus = async (sessionId) => {
  const res = await axiosInstance.get(
    `${endpoints.LICENSE_STATUS}/${sessionId}`
  );
  return res.data;
};

export const getVehicleCategories = async () => {
  const res = await axiosInstance.get(endpoints.LICENSE_VEHICLE_CATEGORIES);
  return res.data;
};

export const createLicense = async ({
  sessionId,
  validityYears,
  issuingAuthority,
  restrictions,
  endorsements,
  vehicleCategories,
  categoryValidFrom,
  categoryValidUntil,
  categoryRestrictions,
  documentTypes,
  documents,
}) => {
  // Create formData for supporting documents
  const formData = new FormData();
  documents.forEach((file) => {
    formData.append("supportingDocuments", file.originFileObj);
  });

  // Build URL with proper query parameters
  const params = new URLSearchParams();
  params.append("sessionId", sessionId);
  params.append("validityYears", validityYears);
  params.append("issuingAuthority", issuingAuthority);
  params.append("restrictions", restrictions);
  params.append("endorsements", endorsements);

  // Add each vehicle category as separate parameter
  const categories = Array.isArray(vehicleCategories)
    ? vehicleCategories
    : vehicleCategories.split(",").map((cat) => cat.trim());

  categories.forEach((category) => {
    params.append("vehicleCategories", category);
  });

  params.append("categoryValidFrom", categoryValidFrom);
  params.append("categoryValidUntil", categoryValidUntil);
  params.append("categoryRestrictions", categoryRestrictions);

  // Handle documentTypes the same way (multiple params)
  const docTypes = Array.isArray(documentTypes)
    ? documentTypes
    : documentTypes.split(",").map((doc) => doc.trim());

  docTypes.forEach((docType) => {
    params.append("documentTypes", docType);
  });

  const url = `${endpoints.LICENSE_CREATE}?${params.toString()}`;

  const response = await axiosInstance.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const getLicense = async () => {
  const res = await axiosInstance.get(endpoints.GET_ALL_LICENSES);
  return res.data;
};

export const changeImageUrl = async (imageUrl) => {
  const res = await axiosInstance.get(
    `${endpoints.CHANGE_LICENSE_IMAGE_STATUS}/${imageUrl}`
  );
  return res.data;
};

export const statusCount = async () => {
  const res = await axiosInstance.get(endpoints.LICENSE_COUNT);
  return res.data;
};

export default {
  requestLicense,
  checkLicenseStatus,
  createLicense,
  getVehicleCategories,
  getLicense,
  changeImageUrl,
  statusCount,
};
