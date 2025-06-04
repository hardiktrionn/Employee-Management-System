import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function UserLayout({ children }) {
  return (
    <AuthGuard>
      <Navbar />
      <main className="p-4">{children}</main>
      <Footer />
    </AuthGuard>
  );
}
