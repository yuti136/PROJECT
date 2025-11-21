// client/src/components/chat/ChatSidebar.jsx

import { useEffect, useState } from "react";
import { getConversations } from "@/services/chat";
import { socket } from "@/socket";

export default function ChatSidebar({ onSelectUser, selectedUser }) {
  const [conversations, setConversations] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadConversations();

    // refresh on new message
    socket.on("chat:message", loadConversations);

    return () => {
      socket.off("chat:message", loadConversations);
    };
  }, []);

  const loadConversations = async () => {
    const data = await getConversations(token);
    setConversations(data);
  };

  return (
    <div className="w-72 bg-white border-r h-full overflow-y-auto shadow-sm">
      <h2 className="text-xl font-bold p-4 border-b">Messages</h2>

      {/* CONVERSATION LIST */}
      {conversations.map((item) => {
        const user = item.user;
        const lastText = item.lastText || "No messages yet";
        const unread = item.unreadCount;
        const lastAt = item.lastAt
          ? new Date(item.lastAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        const isActive = selectedUser?._id === user._id;

        return (
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
            className={`flex items-center p-3 cursor-pointer border-b 
              ${
                isActive
                  ? "bg-green-100"
                  : "hover:bg-gray-100 transition-colors"
              }
            `}
          >
            {/* Avatar circle */}
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl mr-3">
              {user.name[0]}
            </div>

            <div className="flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600 truncate max-w-[150px]">
                {lastText}
              </p>
            </div>

            {/* RIGHT SIDE: time + unread */}
            <div className="text-right">
              <p className="text-xs text-gray-500">{lastAt}</p>

              {unread > 0 && (
                <div className="mt-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center mx-auto">
                  {unread}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
