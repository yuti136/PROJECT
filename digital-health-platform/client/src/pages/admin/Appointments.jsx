import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { API_URL } from "../../services/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/admin/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(data);
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Appointments</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Records</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Patient</th>
                <th className="p-2">Provider</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="border-b">
                  <td className="p-2">{a.patient?.name}</td>
                  <td className="p-2">{a.provider?.name}</td>
                  <td className="p-2">{new Date(a.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
