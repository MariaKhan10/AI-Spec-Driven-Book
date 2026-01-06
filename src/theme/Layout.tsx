// src/theme/Layout.tsx
import React from "react";
import OriginalLayout from "@theme-original/Layout";
import ChatWidget from "../components/ChatWidget";
import AuthNavbar from "../components/Navbar/AuthNavbar";
import { useLocation } from "@docusaurus/router";
import { AuthProvider } from "../contexts/AuthContext";
import { PersonalizationProvider } from "../components/Personalization/PersonalizationProvider";
import { useAuth } from "../contexts/AuthContext";

// Wrapper component to access auth context for personalization
const PersonalizationLayoutWrapper = (props) => {
  const { state } = useAuth();
  const userId = state.user?.id;

  return (
    <PersonalizationProvider userId={userId}>
      <OriginalLayout {...props} />
    </PersonalizationProvider>
  );
};

export default function Layout(props) {
  const location = useLocation();

  // Show chatbot only on /docs pages
  const showChat = location.pathname.startsWith("/AI-Spec-Driven-Book/docs");

  return (
    <AuthProvider>
      <>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            right: '13rem', /* Adjusted to not overlap with other right-aligned items */
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none' /* Allow clicks to pass through to underlying elements */
          }}>
            <div style={{ pointerEvents: 'auto' }}>
              <AuthNavbar />
            </div>
          </div>
          <PersonalizationLayoutWrapper {...props} />
        </div>

        {showChat && (
          <div style={{ position: "fixed", bottom: 30, right: 30, zIndex: 99999 }}>
            <ChatWidget />
          </div>
        )}
      </>
    </AuthProvider>
  );
};
