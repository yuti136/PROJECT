// client/src/services/appointments.js
import { API_URL } from "./api";

export const createAppointment = async (token, data) => {
  const res = await fetch(`${API_URL}/api/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getAppointments = async (token) => {
  const res = await fetch(`${API_URL}/api/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/* ===========================
   Provider actions
   Backend routes:
     PUT /api/appointments/accept/:id
     PUT /api/appointments/reject/:id
   Make sure these match your server exactly.
   =========================== */
export const acceptAppointment = async (token, appointmentId) => {
  const res = await fetch(
    `${API_URL}/api/appointments/accept/${appointmentId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
};

export const rejectAppointment = async (token, appointmentId) => {
  const res = await fetch(
    `${API_URL}/api/appointments/reject/${appointmentId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
};

/* Optional: admin cancel / delete helpers (if you want to call from admin UI)
   Note: adminRoutes already exposes cancel/delete; adjust paths if different.
*/
export const adminCancelAppointment = async (token, appointmentId) => {
  const res = await fetch(
    `${API_URL}/api/admin/appointments/cancel/${appointmentId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.json();
};

export const adminDeleteAppointment = async (token, appointmentId) => {
  const res = await fetch(
    `${API_URL}/api/admin/appointments/delete/${appointmentId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.json();
};
