import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { API_URL } from "../../services/api";

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/admin/providers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProviders(data);
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Healthcare Providers</h1>

      <Card>
        <CardHeader>
          <CardTitle>Registered Providers</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Verified</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.email}</td>
                  <td className="p-2">{p.isVerified ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
