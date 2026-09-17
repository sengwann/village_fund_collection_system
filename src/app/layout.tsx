import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { APP_NAME } from "@/lib/env";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Multi-tenant village fund collection and household management system foundation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-slate-50">{children}</body>
    </html>
  );
}
