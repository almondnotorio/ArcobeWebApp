import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arcobe Construction Corporation",
  description: "Building the Future, One Project at a Time. Arcobe Construction Corporation delivers excellence in commercial, residential, and infrastructure construction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
