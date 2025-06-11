"use client"
import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const UserLayout = ({ children }) => {
  return (
    // Validate the User are Valid or not
    <AuthGuard>
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main className="px-5 py-2 sm:px-20 sm:py-10">{children}</main>
      {/* Footer */}
      <Footer />
    </AuthGuard>
  );
};

export default UserLayout;
