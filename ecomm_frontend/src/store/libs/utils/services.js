import axios from "axios";

const api = axios.create({
  baseURL: "http://13.234.30.65:8000", // update if needed
});

export const getProducts = async () => {
  const response = await api.get("/api/users/products");
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/api/users/products/${id}`);
  return response.data;
};