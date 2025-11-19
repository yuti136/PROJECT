import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  getAllUsers,
  suspendUser,
  deleteUser,
  promoteUser,
} from "../../services/admin";

import { Button } from "@/components/ui/button";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  async function loadUsers() {
    setLoading(true);
    const data = await getAllUsers(token);
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // HANDLERS
  async function handleSuspend(id) {
    await suspendUser(id, token);
    loadUsers();
  }

  async function handleDelete(id) {
    await deleteUser(id, token);
    loadUsers();
  }

  async function handlePromote(id) {
    await promoteUser(id, token);
    loadUsers();
  }

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Active</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 capitalize">{u.role}</td>

                  {/* Handle undefined isActive */}
                  <td className="p-2">{u.isActive === false ? "No" : "Yes"}</td>

                  <td className="p-2 space-x-2">
                    {/* SUSPEND BUTTON */}
                    <Button
                      variant="outline"
                      onClick={() => handleSuspend(u._id)}
                      disabled={u.isActive === false}
                    >
                      Suspend
                    </Button>

                    {/* PROMOTE BUTTON */}
                    {u.role !== "provider" && u.role !== "admin" && (
                      <Button
                        variant="outline"
                        onClick={() => handlePromote(u._id)}
                      >
                        Promote
                      </Button>
                    )}

                    {/* DELETE BUTTON */}
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
