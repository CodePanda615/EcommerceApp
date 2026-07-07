import adminApi from "../api/adminApi";

export const getOrders = async () => {
  const response = await adminApi.get("/api/admin/orders");
  return response.data;
};

export const getOrder = async (id) => {
  const response = await adminApi.get(`/api/admin/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await adminApi.patch(`/api/admin/orders/${id}/status`, {
    status,
  });
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await adminApi.patch(`/api/admin/orders/${id}/cancel`);
  return response.data;
};
