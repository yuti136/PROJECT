import { API_URL } from "./api";

/* ===============================
   GET ALL USERS
================================ */
export async function getAllUsers(token) {
  const res = await fetch(`${API_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}

/* ===============================
   GET ADMIN DASHBOARD STATS
================================ */
export async function getAdminStats(token) {
  const res = await fetch(`${API_URL}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await res.json();
}

/* ===============================
   PROMOTE USER → PROVIDER
================================ */
export async function promoteUser(userId, token) {
  const res = await fetch(`${API_URL}/api/admin/promote/${userId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await res.json();
}

/* ===============================
   VERIFY PROVIDER
================================ */
export async function verifyProvider(userId, token) {
  const res = await fetch(`${API_URL}/api/admin/approve-provider/${userId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await res.json();
}

/* ===============================
   SUSPEND USER
================================ */
export async function suspendUser(userId, token) {
  const res = await fetch(`${API_URL}/api/admin/suspend/${userId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await res.json();
}

/* ===============================
   DELETE USER
================================ */
export async function deleteUser(userId, token) {
  const res = await fetch(`${API_URL}/api/admin/delete/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await res.json();
}
