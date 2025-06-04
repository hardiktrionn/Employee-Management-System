import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function UserLayout({ children }) {
  return (
    <AuthGuard>
      <Navbar />
      <main className="p-4">{children}</main>
      <Footer />
    </AuthGuard>
  );
}
