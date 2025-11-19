import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getAllUsers } from "../../services/admin";
import { getAppointmentAnalytics } from "../../services/analytics";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      const usersData = await getAllUsers(token);
      setUsers(usersData);

      const analyticsData = await getAppointmentAnalytics(token);
      setAnalytics(analyticsData);
    }

    load();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-3xl font-bold">{users.length}</p>
          </Card>

          {analytics && (
            <Card className="p-4">
              <h2 className="text-lg font-semibold">Monthly Appointments</h2>
              <p className="text-3xl font-bold">{analytics.last30Days.length}</p>
            </Card>
          )}
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
          </CardHeader>

          <CardContent>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 capitalize">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
