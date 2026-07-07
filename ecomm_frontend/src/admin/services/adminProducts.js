import adminApi from "../api/adminApi";

export const getProducts = async () => {
  const response = await adminApi.get("/api/admin/products");
  return response.data;
};

export const getProduct = async (id) => {
  const response = await adminApi.get(`/api/admin/products/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await adminApi.post("/api/admin/products", data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await adminApi.put(`/api/admin/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await adminApi.delete(`/api/admin/products/${id}`);
  return response.data;
};

export const updateProductStock = async (id, stock) => {
  const response = await adminApi.patch(
    `/api/admin/products/${id}/stock?stock=${stock}`
  );
  return response.data;
};

export const updateProductStatus = async (id, isActive) => {
  const response = await adminApi.patch(
    `/api/admin/products/${id}/status?is_active=${isActive}`
  );
  return response.data;
};
