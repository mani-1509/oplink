import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { AuthProvider } from "@/lib/AuthContext";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OPLINK | Autonomous Integration Engineering Agent",
  description: "AI agent that connects disconnected business tools, automatically builds and fixes integrations, and proves their business value.",
  icons: {
    icon: "/oplink.png",
    shortcut: "/oplink.png",
    apple: "/oplink.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceMono.variable} bg-[#0a0a0a] text-[#fefefe]`}>
      <body className="font-mono min-h-screen flex flex-col bg-[#0a0a0a] selection:bg-[#a600ff] selection:text-black font-normal">
        <AuthProvider>
          <LenisProvider>{children}</LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
