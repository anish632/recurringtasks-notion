import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RecurringTasks — Automate Recurring Tasks in Notion",
  description: "Stop manually creating the same Notion pages. Set a schedule — daily, weekly, monthly — and let RecurringTasks create them automatically.",
  keywords: ["Notion", "recurring tasks", "automation", "productivity", "task management", "Notion integration"],
  openGraph: {
    title: "RecurringTasks — Automate Recurring Tasks in Notion",
    description: "Set it once, let it run forever. The most requested Notion feature, finally solved.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
