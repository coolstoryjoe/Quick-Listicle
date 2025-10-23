import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quick Listicle",
  description: "A collection of websites you want to remember",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
