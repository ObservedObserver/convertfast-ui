import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConvertFast template preview",
  description: "A Next.js sample built with ConvertFast landing page components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
