// client/src/pages/Chat.jsx

import React, { useEffect, useState } from "react";
import { socket } from "@/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const userId = localStorage.getItem("userId");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.connect();

    console.log("JOINING ROOM:", userId);
    socket.emit("join", userId);

    // Listen for incoming messages
    socket.on("chat:message", (msg) => {
      console.log("📩 RECEIVED MESSAGE:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat:message");
    };
  }, [userId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const msg = {
      from: userId,
      to: userId === "patient" ? "provider" : "patient", // temporary
      message: text,
      timestamp: new Date().toISOString(),
    };

    console.log("📤 SENDING:", msg);
    socket.emit("chat:send", msg);

    setText("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      <div className="border rounded p-3 h-80 overflow-y-auto bg-gray-50">
        {messages.map((m, i) => (
          <p key={i} className={m.from === userId ? "text-blue-600" : "text-green-700"}>
            <strong>{m.from === userId ? "Me" : "Them"}:</strong> {m.message}
          </p>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
