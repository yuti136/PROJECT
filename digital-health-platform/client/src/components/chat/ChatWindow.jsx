import { useEffect, useState, useRef } from "react";
import { getMessages, sendMessageAPI } from "@/services/chat";
import MessageInput from "./MessageInput";
import { socket } from "@/socket";

export default function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("userId");

  const bottomRef = useRef(null);

  useEffect(() => {
    if (selectedUser) loadMessages();
  }, [selectedUser]);

  useEffect(() => {
    socket.on("chat:message", (msg) => {
      // only update if message belongs to current chat
      if (
        selectedUser &&
        (msg.from === selectedUser._id || msg.to === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    return () => socket.off("chat:message");
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
    if (!text) return;

    const messageData = {
      from: currentUser,
      to: selectedUser._id,
      text,
      createdAt: new Date(),
    };

    // API store
    await sendMessageAPI(token, messageData);

    // Send socket event
    socket.emit("chat:send", messageData);

    setMessages((prev) => [...prev, messageData]);
    scrollToBottom();
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b bg-white flex items-center gap-3">
        <h2 className="font-semibold text-lg">{selectedUser.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 flex ${
              m.from === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                m.from === currentUser
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
