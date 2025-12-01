// src/theme/Layout.tsx
import React from "react";
import OriginalLayout from "@theme-original/Layout";
import ChatWidget from "../components/ChatWidget";
import { useLocation } from "@docusaurus/router";

export default function Layout(props) {
  const location = useLocation();

  // Show chatbot only on /docs pages
  const showChat = location.pathname.startsWith("/AI-Spec-Driven-Book/docs");

  return (
    <>
      <OriginalLayout {...props} />

      {showChat && (
        <div style={{ position: "fixed", bottom: 30, right: 30, zIndex: 99999 }}>
          <ChatWidget />
        </div>
      )}
    </>
  );
}
