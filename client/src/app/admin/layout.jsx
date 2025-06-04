import AdminGuard from "@/components/AdminGuard";
import AdminNavbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";

const layout = ({ children }) => {
  return (
    <>
      <AdminGuard>
        <AdminNavbar />
        <div className="flex w-full">
          <Sidebar />
          {children}
        </div>
      </AdminGuard>
    </>
  );
};

export default layout;
