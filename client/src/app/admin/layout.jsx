import AdminGuard from "@/components/AdminGuard";
import AdminNavbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";

const layout = ({ children }) => {
  return (
    <>
      <AdminGuard>
        <AdminNavbar />
        <div className="flex w-full h-[90vh]">
          <Sidebar />

          <div className="overflow-y-auto w-full">{children}</div>
        </div>
      </AdminGuard>
    </>
  );
};

export default layout;
