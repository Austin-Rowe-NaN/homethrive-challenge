import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme/theme-provider.tsx";
import { MobileAppViewProvider } from "@/contexts/mobile-app-view-context.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/trpc.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <MobileAppViewProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MobileAppViewProvider>
    </ThemeProvider>
  </StrictMode>
);
