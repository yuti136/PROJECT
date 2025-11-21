// client/src/pages/Chat.jsx

import React, { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/services/api";

export default function Chat() {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // 🔥 correct receiver detection
  const receiver =
    role === "patient"
      ? localStorage.getItem("providerId")
      : localStorage.getItem("patientId");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef();

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* LOAD MESSAGE HISTORY */
  useEffect(() => {
    if (!receiver) {
      console.warn("❗ Chat cannot load. No receiver assigned yet.");
      return;
    }

    fetch(`${API_URL}/api/chat/${receiver}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => setMessages(data));
  }, [receiver]);

  /* SOCKET SETUP */
  useEffect(() => {
    if (!receiver) return;

    socket.connect();
    socket.emit("join", userId);

    const handleIncoming = (msg) => {
      if (
        (msg.sender._id === userId && msg.receiver._id === receiver) ||
        (msg.sender._id === receiver && msg.receiver._id === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTyping = ({ from }) => {
      if (from === receiver) {
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
  }, [receiver]);

  const sendMessage = async () => {
    if (!text.trim() || !receiver) return;

    try {
      const res = await fetch(`${API_URL}/api/chat/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiver, text }),
      });

      const msg = await res.json();

      socket.emit("chat:send", msg);

      setText("");
    } catch (e) {
      console.error("Send message error", e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-green-600 text-white p-4 flex items-center gap-3 shadow">
        <div className="w-10 h-10 bg-white rounded-full"></div>
        <div>
          <h2 className="font-bold text-lg">
            {role === "patient" ? "Your Provider" : "Your Patient"}
          </h2>
          <p className="text-sm">
            {receiver ? (typing ? "typing…" : "online") : "not assigned yet"}
          </p>
        </div>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-200">
        {receiver ? (
          messages.map((m, i) => {
            const mine = m.sender._id === userId;

            return (
              <div
                key={i}
                className={`max-w-xs px-3 py-2 rounded-lg text-sm shadow 
                  ${mine ? "ml-auto bg-green-500 text-white" : "mr-auto bg-white"}
                `}
              >
                {m.text}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-600 mt-10">
            You must create or accept an appointment before chat is enabled.
          </p>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT BAR */}
      {receiver && (
        <div className="p-3 bg-white flex gap-2 border-t">
          <Input
            placeholder="Message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={() =>
              socket.emit("chat:typing", { from: userId, to: receiver })
            }
            className="flex-1"
          />

          <Button
            onClick={sendMessage}
            className="bg-green-600 text-white"
          >
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
