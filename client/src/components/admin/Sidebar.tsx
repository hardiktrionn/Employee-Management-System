import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCalendarAlt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { MdDashboard, MdExitToApp } from "react-icons/md";
import type { IconType } from "react-icons";

interface SidebarItem {
  icon: IconType;
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: MdDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: FiUsers, label: "Employees", path: "/admin/employee" },
  { icon: FaCalendarAlt, label: "Attendance", path: "/admin/attendance" },
  { icon: MdExitToApp, label: "Leave", path: "/admin/leave" },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed lg:static inset-y-0 left-0 z-10 top-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:transform-none">
      {/* User Profile */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col items-center text-center">
          <h3 className="font-bold text-gray-800 mt-4">Welcome Admin</h3>
          <p className="text-sm text-gray-500">Today</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {sidebarItems.map((item, index) => {
            const isActive = pathname ? pathname.startsWith(item.path) : false;

            return (
              <Link
                key={index}
                href={item.path}
                className={`group flex flex-col items-center p-4 rounded-xl transition-all border border-gray-200 shadow-md duration-300 transform hover:scale-105 ${isActive
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-amber-500/25"
                    : "text-gray-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:shadow-md"
                  }`}
              >
                <item.icon
                  className={`w-6 h-6 mb-2 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-gray-500"
                    }`}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
