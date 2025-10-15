"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  // Arranca MSW en dev solo si está habilitado por env
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
    ) {
      const swUrl = "/mockServiceWorker.js";
      import("@/mocks/browser").then(({ worker }) => {
        worker.start({
          serviceWorker: { url: swUrl },
          onUnhandledRequest: "bypass",
        });
      });
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
