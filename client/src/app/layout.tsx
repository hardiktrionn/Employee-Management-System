"use client"

import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import ReduxProvider from "../lib/ReduxProvider";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Toaster for show user error,success message */}
        <Toaster />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
