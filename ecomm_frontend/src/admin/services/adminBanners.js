import adminApi from "../api/adminApi";

export const getBanners = async () => {
  const response = await adminApi.get("/api/admin/banner");
  return response.data;
};

export const createBanner = async (data) => {
  const response = await adminApi.post("/api/admin/banner", data);
  return response.data;
};

export const deleteBanner = async (id) => {
  const response = await adminApi.delete(`/api/admin/banner/${id}`);
  return response.data;
};
