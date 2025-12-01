import React, { useState, useEffect, useRef } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
      
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error connecting to server." },
      ]);
    }
  };
  

  return (
    <div style={{ position: "fixed", bottom: 30, right: 30, zIndex: 9999 }}>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #8E2DE2, #B347FF)",
          color: "#fff",
          fontSize: 28,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(179, 71, 255, 0.5)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        💬
      </button>

      {/* Chat popup */}
      {open && (
        <div
          style={{
            width: 360,
            height: 480,
            background: "rgba(15, 15, 20, 0.95)",
            borderRadius: 12,
            boxShadow: "0 12px 28px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            marginTop: 12,
            overflow: "hidden",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: 12,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? "#8E2DE2" : "#333",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: 10,
                  maxWidth: "75%",
                  wordBreak: "break-word",
                  boxShadow:
                    m.role === "user"
                      ? "0 2px 8px rgba(142,45,226,0.5)"
                      : "0 2px 6px rgba(0,0,0,0.5)",
                }}
              >
                {m.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              background: "#020202ff",
            }}
          >
            <input
              style={{
                flex: 1,
                padding: "14px 16px",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#fff",
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me about the book..."
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "0 16px",
                background: "linear-gradient(135deg, #8E2DE2, #B347FF)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
