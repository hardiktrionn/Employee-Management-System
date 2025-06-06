"use client";

import { ReactNode } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminNavbar from "../../components/admin/Navbar";
import dynamic from "next/dynamic";
const Sidebar = dynamic(() => import("../../components/admin/Sidebar"))

interface RootLayoutProps {
  children: ReactNode;
}


const Layout = ({ children }: RootLayoutProps) => {
  return (

    <AdminGuard>
      <AdminNavbar />
      <div className="flex w-full h-[90vh]">
        <Sidebar />
        <main className="overflow-y-auto w-full">{children}</main>
      </div>
    </AdminGuard>

  );
};

export default Layout;
