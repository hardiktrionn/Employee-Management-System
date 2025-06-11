"use client";

import AdminGuard from "../../components/AdminGuard";
import AdminNavbar from "../../components/admin/Navbar";
import dynamic from "next/dynamic";
const Sidebar = dynamic(() => import("../../components/admin/Sidebar"))


const Layout = ({ children }) => {
  return (
 // Validate the Admin are Valid or not
    <AdminGuard>
      {/* Admin navbar */}
      <AdminNavbar />
      <div className="flex w-full h-[90vh]">
        {/* Admin sidebar */}
        <Sidebar />
        <main className="overflow-y-auto w-full">{children}</main>
      </div>
    </AdminGuard>

  );
};

export default Layout;
