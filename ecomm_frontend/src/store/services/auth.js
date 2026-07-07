import api from "../../api/axios";

export const registerUser = async (data) => {
  const response = await api.post(
    "/api/users/auth/register",
    data
  );

  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post(
    "/api/users/auth/login",
    data
  );

  return response.data;
};

export const migrateGuestCart = async (token) => {
  const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

  if (guestCart.length === 0) return;

  try {
    for (const item of guestCart) {
      await api.post(
        "/api/users/cart",
        {
          product_id: item.product_id,
          quantity: item.qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    localStorage.removeItem("guestCart");
  } catch (err) {
    console.error("Error migrating guest cart:", err);
  }
};