import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/services/api";

export default function ChatsList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const myId = localStorage.getItem("userId");

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsers(data.filter(u => u._id !== myId)); // Remove myself
    }
    load();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>

      <div className="space-y-2">
        {users.map(user => (
          <div
            key={user._id}
            className="p-3 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/chat/${user._id}`)}
          >
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
