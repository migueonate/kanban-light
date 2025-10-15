import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "./providers";

export const metadata: Metadata = {
  title: "Kanban Light",
  description: "Prueba técnica React Senior",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
