import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { API_URL } from "../../services/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/admin/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPatients(data);
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Patients</h1>

      <Card>
        <CardHeader>
          <CardTitle>Registered Patients</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
