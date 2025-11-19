import { API_URL } from "./api";

export const getAppointmentAnalytics = async (token) => {
  const res = await fetch(`${API_URL}/api/analytics/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
