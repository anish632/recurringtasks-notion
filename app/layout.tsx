import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecurringTasks for Notion - Automate Your Recurring Tasks",
  description: "The #1 most requested Notion feature. Automatically create recurring task pages in your Notion databases on any schedule.",
  keywords: ["Notion", "automation", "recurring tasks", "productivity", "task management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
