// client/src/pages/Chat.jsx

import React, { useEffect, useRef, useState } from "react";
import { socket } from "@/socket";
import { API_URL } from "@/services/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Determine chat partner
  const partnerId = role === "patient" ? "provider" : "patient";

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("offline");

  const messagesEndRef = useRef(null);

  /* ============================================
        AUTO SCROLL TO BOTTOM
  ============================================ */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  /* ============================================
        LOAD CHAT HISTORY
  ============================================ */
  const loadHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat/history/${partnerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Chat history error:", err);
    }
  };

  /* ============================================
        SOCKET INITIALIZATION
  ============================================ */
  useEffect(() => {
    socket.connect();
    socket.emit("join", userId);

    loadHistory();

    socket.on("chat:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("chat:typing", ({ from }) => {
      if (from === partnerId) {
        setPartnerTyping(true);
        setTimeout(() => setPartnerTyping(false), 1500);
      }
    });

    socket.on("user:online", (id) => {
      if (id === partnerId) setOnlineStatus("online");
    });

    socket.on("user:offline", (id) => {
      if (id === partnerId) setOnlineStatus("offline");
    });

    return () => {
      socket.off("chat:message");
      socket.off("chat:typing");
      socket.off("user:online");
      socket.off("user:offline");
    };
  }, []);

  /* ============================================
        SEND MESSAGE
  ============================================ */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const msg = {
      from: userId,
      to: partnerId,
      text,
      createdAt: new Date().toISOString(),
    };

    // Real-time send
    socket.emit("chat:send", msg);

    // Save to DB
    await fetch(`${API_URL}/api/chat/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(msg),
    });

    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  /* ============================================
        TYPING INDICATOR
  ============================================ */
  const handleTyping = (e) => {
    setText(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit("chat:typing", { from: userId, to: partnerId });
      setTimeout(() => setTyping(false), 1500);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* ================= HEADER ================ */}
      <div className="bg-white p-4 flex items-center gap-3 shadow">
        <div className={`w-3 h-3 rounded-full ${onlineStatus === "online" ? "bg-green-500" : "bg-gray-400"}`}></div>
        <h1 className="text-lg font-semibold">Chat with {partnerId}</h1>
      </div>

      {/* ================= MESSAGES ================ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
              msg.from === userId
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-300 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* Typing indicator */}
        {partnerTyping && (
          <div className="mr-auto italic text-gray-600 text-sm">Typing...</div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* ================= INPUT ================ */}
      <div className="p-3 bg-white flex gap-2 shadow-lg">
        <Input
          placeholder="Type a message..."
          value={text}
          onChange={handleTyping}
        />

        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
