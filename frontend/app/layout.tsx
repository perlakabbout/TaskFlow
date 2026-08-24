import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "TaskFlow public frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}