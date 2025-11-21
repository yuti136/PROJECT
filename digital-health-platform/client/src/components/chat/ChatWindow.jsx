// client/src/components/chat/ChatWindow.jsx

import { useEffect, useState, useRef } from "react";
import { getMessages, sendMessageAPI } from "@/services/chat";
import MessageInput from "./MessageInput";
import { socket } from "@/socket";

export default function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const currentUser = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const bottomRef = useRef(null);

  /* Load messages when a user is selected */
  useEffect(() => {
    if (!selectedUser) return;
    loadMessages();
  }, [selectedUser]);

  /* Socket listeners */
  useEffect(() => {
    const handleIncoming = (msg) => {
      if (
        !selectedUser ||
        !msg.sender ||
        !msg.receiver
      ) return;

      if (
        msg.sender._id === selectedUser._id ||
        msg.receiver._id === selectedUser._id
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    };

    const handleTyping = ({ from }) => {
      if (from === selectedUser._id) {
        setTyping(true);
        setTimeout(() => setTyping(false), 1500);
      }
    };

    socket.on("chat:message", handleIncoming);
    socket.on("chat:typing", handleTyping);

    return () => {
      socket.off("chat:message", handleIncoming);
      socket.off("chat:typing", handleTyping);
    };
  }, [selectedUser]);

  const loadMessages = async () => {
    const data = await getMessages(token, selectedUser._id);
    setMessages(data);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const messageData = {
      receiver: selectedUser._id,
      text
    };

    // Save to database
    const saved = await sendMessageAPI(token, messageData);

    // Emit socket
    socket.emit("chat:send", saved);

    setMessages((prev) => [...prev, saved]);
    scrollToBottom();
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* HEADER (WhatsApp style) */}
      <div className="p-4 bg-green-600 text-white flex items-center gap-3 shadow">
        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-lg">
          {selectedUser.name[0]}
        </div>
        <div>
          <h2 className="font-bold text-lg">{selectedUser.name}</h2>
          <p className="text-sm opacity-80">
            {typing ? "typing..." : "online"}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-200 space-y-2">

        {messages.map((m, i) => {
          const mine = m.sender?._id === currentUser;

          return (
            <div
              key={i}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm shadow 
                  ${mine ? "bg-green-500 text-white" : "bg-white"}
                `}
              >
                {m.text}
                <div className="text-[10px] pt-1 opacity-60 text-right">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT BOX */}
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
