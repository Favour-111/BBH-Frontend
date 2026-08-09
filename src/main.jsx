import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import { SiteDataProvider } from "./context/SiteDataContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SiteDataProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <App />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#191512",
                  color: "#fffdf9",
                  fontSize: "14px",
                  borderRadius: "4px",
                },
              }}
            />
          </AdminAuthProvider>
        </AuthProvider>
      </SiteDataProvider>
    </BrowserRouter>
  </StrictMode>
);
