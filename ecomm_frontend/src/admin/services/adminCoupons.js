import adminApi from "../api/adminApi";

export const getCoupons = async () => {
  const response = await adminApi.get("/api/admin/coupons");
  return response.data;
};

export const getCoupon = async (id) => {
  const response = await adminApi.get(`/api/admin/coupons/${id}`);
  return response.data;
};

export const createCoupon = async (data) => {
  const response = await adminApi.post("/api/admin/coupons", data);
  return response.data;
};

export const updateCoupon = async (id, data) => {
  const response = await adminApi.put(`/api/admin/coupons/${id}`, data);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await adminApi.delete(`/api/admin/coupons/${id}`);
  return response.data;
};

export const updateCouponStatus = async (id, isActive) => {
  const response = await adminApi.patch(
    `/api/admin/coupons/${id}/status?is_active=${isActive}`
  );
  return response.data;
};
