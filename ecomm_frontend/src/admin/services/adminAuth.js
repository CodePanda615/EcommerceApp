import adminApi from "../api/adminApi";

export const adminLogin = async (data) => {
  const response = await adminApi.post("/api/admin/auth/login", data);
  return response.data;
};

export const adminRegister = async (data) => {
  const response = await adminApi.post("/api/admin/auth/register", data);
  return response.data;
};
