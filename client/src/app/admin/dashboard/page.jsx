"use client";
import Loader from "@/components/Loader";
import { fetchAllEmplyoee } from "@/redux/adminSlice";
import { useEffect, useState } from "react";
import { FiUsers, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("admin");
  const { isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { isFetchingEmployee, employee } = useSelector((state) => state.admin);
  const [statsCards, setStatsCards] = useState([
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

  useEffect(() => {
    setStatsCards((prev) =>
      prev.map((card) =>
        card.label === "Employees"
          ? { ...card, value: employee?.length || 0 }
          : card
      )
    );
  }, [employee]);

  useEffect(() => {
    dispatch(fetchAllEmplyoee());
  }, [dispatch]);

  if (isFetchingEmployee || isLoading) return <Loader />;

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
                  className={`flex items-center text-sm font-medium ${
                    card.trend === "up" ? "text-green-600" : "text-red-500"
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
