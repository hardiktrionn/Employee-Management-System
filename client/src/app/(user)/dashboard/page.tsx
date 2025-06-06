"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUsers } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa";

const DashboardPage = () => {
  const pathname = usePathname();
  const sidebarItems = [
    { icon: MdDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FaCalendarCheck, label: "Attendance", path: "/attendance" },
    { icon: FiUsers, label: "Profile", path: "/profile" },
  ];

  return (
    <nav aria-label="Main navigation" className="p-4">
      <div className="grid grid-cols-8 gap-5">
        {sidebarItems.map((item) => {
          const isActive = pathname ? pathname.startsWith(item.path) : false
          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={isActive ? "page" : undefined}
              className={`group flex flex-col items-center px-8 py-6 rounded-xl transition-all border border-gray-200 shadow-md duration-300 transform hover:scale-105 ${isActive
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
  );
};

export default DashboardPage;
