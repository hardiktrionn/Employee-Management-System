"use client";

import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import ReduxProvider from "../lib/ReduxProvider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Toaster />
          <ReduxProvider>{children}</ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
