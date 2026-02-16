import "./globals.css";
import { ReactNode } from "react";
import { Manrope } from "next/font/google";
import { ToastProvider } from "@/components/ui/ToastProvider";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata = {
  title: "Smart Bookmarks",
  description: "Private bookmark manager with realtime sync",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.className} app-bg min-h-screen antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
