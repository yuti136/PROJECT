import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useParams } from "react-router-dom";
import { API_URL } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatRoom() {
  const { peerId } = useParams();
  const myId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 1. Load old messages
  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/users/messages/${peerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    }
    load();
  }, [peerId]);

  // 2. Listen for incoming messages
  useEffect(() => {
    socket.on("chat:message", msg => {
      if (
        (msg.from === peerId && msg.to === myId) ||
        (msg.from === myId && msg.to === peerId)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.off("chat:message");
  }, [peerId]);

  // 3. Send message
  function sendMessage() {
    if (!input.trim()) return;

    const msg = {
      from: myId,
      to: peerId,
      text: input,
      timestamp: new Date(),
    };

    socket.emit("chat:send", msg);
    setMessages(prev => [...prev, msg]);

    setInput("");
  }

  return (
    <div className="p-4 flex flex-col h-screen">
      <h2 className="text-xl font-bold mb-4">Chat</h2>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.from === myId ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"
            } w-fit max-w-[70%]`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
