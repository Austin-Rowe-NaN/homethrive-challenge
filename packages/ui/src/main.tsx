import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { MobileAppViewProvider } from "@/contexts/mobile-app-view-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <MobileAppViewProvider>
        <App />
      </MobileAppViewProvider>
    </ThemeProvider>
  </StrictMode>
);
