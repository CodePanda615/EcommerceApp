import adminApi from "../api/adminApi";

export const getDashboard = async () => {
  const response = await adminApi.get("/api/admin/dashboard");
  return response.data;
};
