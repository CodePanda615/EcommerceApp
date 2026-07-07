import adminApi from "../api/adminApi";

export const getCategories = async () => {
  const response = await adminApi.get("/api/admin/categories");
  return response.data;
};

export const getCategory = async (id) => {
  const response = await adminApi.get(`/api/admin/categories/${id}`);
  return response.data;
};

export const createCategory = async (data) => {
  const response = await adminApi.post("/api/admin/categories", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await adminApi.put(`/api/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await adminApi.delete(`/api/admin/categories/${id}`);
  return response.data;
};
