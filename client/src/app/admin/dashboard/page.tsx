"use client";

import Loader from "../../../components/Loader";
import { useEffect, useState } from "react";
import { FiUsers, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../lib/store"; // Adjust paths as needed
import { IconType } from "react-icons";
import toast from "react-hot-toast";
import { setEmployee } from "../../../redux/adminSlice";

// Define type for each card
interface StatsCard {
  icon: IconType;
  label: string;
  value: number;
  change: string;
  trend: "up" | "down";
  bgGradient: string;
  iconColor: string;
}

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { employee } = useSelector((state: RootState) => state.admin);
  // Main page show current total user with some static value
  const [statsCards, setStatsCards] = useState<StatsCard[]>([
    {
      icon: FiUsers,
      label: "Employees",
      value: employee?.length || 0,
      change: "+12%",
      trend: "up",
      bgGradient: "from-purple-500 to-purple-700",
      iconColor: "text-white",
    },
  ]);

  // if employee change then value are update.
  useEffect(() => {
    setStatsCards((prev) =>
      prev.map((card) =>
        card.label === "Employees"
          ? { ...card, value: employee?.length || 0 }
          : card
      )
    );
  }, [employee]);

// Fetch all employee 
useEffect(() => {
  const fetchAllEmployee = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const res = await fetch(`../api/employee/fetch-all`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        dispatch(setEmployee(data.data));
      } else {
        if (data?.message?.server) toast.error(data?.message.server);
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  fetchAllEmployee();
}, [dispatch]); 


  return (
    <main className="flex-1 p-4 sm:p-6 lg:ml-0">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`bg-gradient-to-br ${card.bgGradient} p-3 rounded-xl shadow-lg`}
                >
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div
                  className={`flex items-center text-sm font-medium ${card.trend === "up" ? "text-green-600" : "text-red-500"
                    }`}
                >
                  {card.trend === "up" ? (
                    <FiTrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <FiTrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {card.change}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {card.value}
                </p>
              </div>
            </div>
            <div
              className={`h-1 bg-gradient-to-r ${card.bgGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
            ></div>
          </div>
        ))}
      </div>
    </main>
  );
}
