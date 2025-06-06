"use client"

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import ReduxProvider from "../lib/ReduxProvider";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
