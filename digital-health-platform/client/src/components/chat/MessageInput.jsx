// client/src/components/chat/MessageInput.jsx

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Smile, Send, Mic } from "lucide-react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Auto-expand height like WhatsApp
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "40px";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [text]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-3 bg-white border-t flex items-end gap-3">

      {/* Emoji Button (future expansion) */}
      <button className="p-2 rounded-full hover:bg-gray-100">
        <Smile className="w-6 h-6 text-gray-500" />
      </button>

      {/* Expanding Textarea */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        placeholder="Type a message…"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
        className={cn(
          "flex-1 resize-none rounded-lg px-3 py-2 bg-gray-100",
          "focus:outline-none focus:ring-1 focus:ring-green-600",
          "text-sm overflow-hidden"
        )}
        style={{ minHeight: "40px", maxHeight: "120px" }}
      />

      {/* Right-Side Action: Mic or Send */}
      {text.trim() === "" ? (
        <button className="p-2 rounded-full bg-green-600 text-white">
          <Mic className="w-5 h-5" />
        </button>
      ) : (
        <Button
          onClick={send}
          className="bg-green-600 text-white px-4 py-2 flex items-center gap-1"
        >
          <Send className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
