import React, { useState, useEffect, useRef } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [showAskButton, setShowAskButton] = useState(false);
  const [askBtnPos, setAskBtnPos] = useState({ x: 0, y: 0 });

  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);

  const BACKEND_URL = "https://backend-production-7d39.up.railway.app";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectionIsInsideWidget = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    const node = sel.anchorNode?.parentElement;
    if (!node || !widgetRef.current) return false;

    return widgetRef.current.contains(node);
  };

  const updateSelection = (mouseEvent = null) => {
    try {
      const sel = window.getSelection();

      const text = sel?.toString().trim() || "";

      if (!text) return setShowAskButton(false);
      if (selectionIsInsideWidget()) return setShowAskButton(false);

      const range = sel.getRangeAt(0);
      let rect = range.getBoundingClientRect();

      if ((!rect || rect.width === 0) && mouseEvent) {
        setAskBtnPos({
          x: mouseEvent.clientX + 8,
          y: mouseEvent.clientY - 40
        });
      } else {
        setAskBtnPos({
          x: Math.min(window.innerWidth - 120, rect.left),
          y: Math.max(8, rect.top - 48)
        });
      }

      setSelectedText(text);
      setShowAskButton(true);
    } catch {
      setShowAskButton(false);
    }
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateSelection);
    document.addEventListener("mouseup", updateSelection);

    return () => {
      document.removeEventListener("selectionchange", updateSelection);
      document.removeEventListener("mouseup", updateSelection);
    };
  }, []);

  const sendMessage = async (customSelectedText = null) => {
    setOpen(true);
    const selText = customSelectedText ?? selectedText ?? "";
    const messageToSend = input || selText;
    if (!messageToSend) return;

    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    setInput("");

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          selected_text: selText
        })
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Server error." }
      ]);
    }

    window.getSelection()?.removeAllRanges();
    setShowAskButton(false);
    setSelectedText("");
  };

  return (
    <>
      {showAskButton && (
        <button
          onClick={() => sendMessage(selectedText)}
          style={{
            position: "fixed",
            top: askBtnPos.y,
            left: askBtnPos.x,
            padding: "10px 14px",
            background: "linear-gradient(135deg, #9b42f5, #d37bff)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 500,
            fontSize: 14,
            zIndex: 2147483647,
            boxShadow: "0 8px 22px rgba(0,0,0,0.25)",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          Ask Chatbot
        </button>
      )}

      {/* CHAT WIDGET */}
      <div
        ref={widgetRef}
        style={{ position: "fixed", bottom: 30, right: 30, zIndex: 9999 }}
      >
        {/* Floating Button */}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7f3df0, #b566ff)",
            color: "#fff",
            fontSize: 30,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 25px rgba(164, 73, 255, 0.6)",
            transition: "0.25s",
          }}
        >
          💬
        </button>

        {/* Chat Window */}
        {open && (
          <div
            style={{
              width: 370,
              height: 500,
              background: "rgba(18, 18, 28, 0.75)",
              backdropFilter: "blur(18px)",
              borderRadius: 16,
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.08)",
              animation: "fadeIn 0.25s ease-out",
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {/* Messages */}
            <div
              style={{
                flex: 1,
                padding: "14px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf:
                      m.role === "user" ? "flex-end" : "flex-start",
                    background:
                      m.role === "user"
                        ? "linear-gradient(135deg, #9a3fe4, #c580ff)"
                        : "rgba(255,255,255,0.08)",
                    padding: "10px 14px",
                    borderRadius: 12,
                    maxWidth: "78%",
                    wordBreak: "break-word",
                    fontSize: 14,
                    boxShadow:
                      m.role === "user"
                        ? "0 4px 12px rgba(158, 76, 255, 0.35)"
                        : "0 3px 10px rgba(0,0,0,0.25)",
                  }}
                >
                  {m.content}
                </div>
              ))}

              <div ref={messagesEndRef}></div>
            </div>

            {/* Input Box */}
            <div
              style={{
                display: "flex",
                background: "rgba(0,0,0,0.45)",
                padding: "10px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                gap: 10,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask something..."
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  color: "#fff",
                  outline: "none",
                  fontSize: 14,
                }}
              />
              <button
                onClick={() => sendMessage()}
                style={{
                  padding: "0 20px",
                  background: "linear-gradient(135deg, #8E2DE2, #B347FF)",
                  border: "none",
                  color: "#fff",
                  borderRadius: 12,
                  fontSize: 14,
                  cursor: "pointer",
                  fontWeight: 500,
                  boxShadow: "0 4px 14px rgba(179,71,255,0.4)",
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
