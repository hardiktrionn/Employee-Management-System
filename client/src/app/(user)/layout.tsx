"use client"
import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <AuthGuard>
      <Navbar />
      <main className="px-5 py-2 sm:px-20 sm:py-10">{children}</main>
      <Footer />
    </AuthGuard>
  );
};

export default UserLayout;
