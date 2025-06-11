"use client";

import { usePathname, useRouter } from "next/navigation";
import { FiUsers } from "react-icons/fi";
import { MdDashboard, MdExitToApp } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

const DashboardPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  // The dashboard main menu to see the user
  const sidebarItems = [
    { icon: MdDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FaCalendarCheck, label: "Attendance", path: "/attendance" },
    { icon: FiUsers, label: "Profile", path: "/profile" },
    { icon: MdExitToApp, label: "Leave", path: "/leave" },
  ];

  return (
    <nav aria-label="Main navigation" className="p-4">
      <div className="grid grid-cols-8 gap-5">
        {sidebarItems.map((item, i) => {
          const isActive = pathname ? pathname.startsWith(item.path) : false;
          const Icon = item.icon;
          return (
            <Card
              key={i}
              className={`cursor-pointer transition-all p-3 min-w-[120px] min-h-[20px] duration-200 hover:shadow-md border-0 ${
                isActive
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-500"
              },
              )`}
              onClick={() => router.push(item.path)}
            >
              <CardContent className="flex flex-col items-center justify-center p-2">
                <Icon
                  className={`w-6 h-6 mb-2 ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </nav>
  );
};

export default DashboardPage;
