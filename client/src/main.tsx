import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  ClerkLoaded,
  ClerkLoading
} from "@clerk/clerk-react";

import App from "./App";
import PublicStatus from "./pages/PublicStatus";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
      <BrowserRouter>
        <ClerkLoading>
          <div style={{ padding: 40 }}>Loading…</div>
        </ClerkLoading>

        <ClerkLoaded>
          <Routes>
            {/* PRIVATE APP */}
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <App />
                  </SignedIn>
                  <SignedOut>
                    <SignIn routing="path" path="/" />
                  </SignedOut>
                </>
              }
            />

            {/* PUBLIC STATUS PAGE */}
            <Route
              path="/status/:orgSlug"
              element={<PublicStatus />}
            />
          </Routes>
        </ClerkLoaded>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
