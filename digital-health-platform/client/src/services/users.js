import { API_URL } from "./api";

export const getProviders = async (token) => {
  const res = await fetch(`${API_URL}/api/users/providers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
