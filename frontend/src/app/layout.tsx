import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Hello Chat",
  description: "We care about you!, Always talk with your family and friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
