import { useEffect, useState } from "react";
import { getConversations } from "@/services/chat";
import { socket } from "@/socket";

export default function ChatSidebar({ onSelectUser, selectedUser }) {
  const [list, setList] = useState([]);
  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("userId");

  useEffect(() => {
    load();

    socket.on("chat:message", () => load());

    return () => {
      socket.off("chat:message");
    };
  }, []);

  const load = async () => {
    const data = await getConversations(token);
    setList(data);
  };

  return (
    <div className="w-72 bg-white border-r p-3 overflow-y-auto">
      <h2 className="text-xl font-bold mb-3">Messages</h2>

      {list.map((user) => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user)}
          className={`p-3 rounded-lg mb-2 cursor-pointer
            ${selectedUser?._id === user._id ? "bg-blue-100" : "hover:bg-gray-100"}
          `}
        >
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      ))}
    </div>
  );
}
