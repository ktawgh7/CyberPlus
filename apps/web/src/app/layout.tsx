import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "CyberPlus — Proving you are a human",
    template: "%s | CyberPlus",
  },
  description:
    "CyberPlus gives every person a verified proof-of-human profile that bots, deepfakes, and fraudsters cannot copy — without exposing who they are.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/icon.png",
  },
  openGraph: {
    title: "CyberPlus — Proving you are a human",
    description:
      "CyberPlus gives every person a verified proof-of-human profile that bots, deepfakes, and fraudsters cannot copy — without exposing who they are.",
    type: "website",
    siteName: "CyberPlus",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-white text-[#171a20] selection:bg-[#3e6ae1] selection:text-white">
        <Navbar />
        <main className="flex-1 bg-white">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
