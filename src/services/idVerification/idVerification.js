import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

export const idverification = async () => {
  const response = await axiosInstance.get(`${endpoints.GET_ALL_PRIVACY}`);
  return response.data;
};

// In your API service file
export const appoinmentConfirm = async ({ userId, documentsValid }) => {
  const response = await axiosInstance.patch(
    `${endpoints.APPOINTMENTS}/${userId}/confirm`,
    null,
    {
      params: {
        documentsValid,
      },
    }
  );
  return response.data;
};
export default { idverification, appoinmentConfirm };
