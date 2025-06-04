"use client";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import formatISODate from "@/utils/formatISODate";
import { FaRegEdit } from "react-icons/fa";
import DeleteModal from "@/components/DeleteConfirmationModal";
import { BiTrash } from "react-icons/bi";
import Link from "next/link";
import { deleteOneEmployee } from "@/redux/adminSlice";
import Loader from "@/components/Loader";

export default function EmployeeDashboard() {
  const { employee, isDeletingEmployee } = useSelector((state) => state.admin);
  const [isDeleteData, setIsDeleteData] = useState(false);
  const dispatch = useDispatch();
  const getTeamBadgeColor = (team) => {
    const colors = {
      Design: "bg-blue-100 text-blue-800 border-blue-200",
      iOS: "bg-green-100 text-green-800 border-green-200",
      Android: "bg-orange-100 text-orange-800 border-orange-200",
      Testing: "bg-blue-100 text-blue-800 border-blue-200",
      PHP: "bg-red-100 text-red-800 border-red-200",
      Business: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Operation Manager": "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colors[team] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getManagerBadgeColor = (manager) => {
    if (manager === "No") {
      return "bg-red-100 text-red-800 border-red-200";
    }
    return "bg-green-100 text-green-800 border-green-200";
  };

  if (isDeletingEmployee) return <Loader />;
  return (
    <div className="flex-1 w-full p-4 sm:p-6 lg:ml-0">
      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="text-lg font-medium text-gray-900">
            {employee.length} People
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search here"
                className="bg-white/10 backdrop-blur-sm border-2 border-gray-300 text-black px-4 py-2 rounded-xl w-64 lg:w-80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              />
              <AiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
            </div>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors">
              <FiPlus className="w-4 h-4" />
              <span>Add Person</span>
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EmployeeId
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  JoiningDate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employee.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={employee.profilePhoto || "/placeholder.svg"}
                        alt={employee.name}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getManagerBadgeColor(
                        employee.lineManager
                      )}`}
                    >
                      {employee.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getTeamBadgeColor(
                        employee.team
                      )}`}
                    >
                      {employee.employeeId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatISODate(employee.joiningDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Link
                        href={`edit/${employee?.id}`}
                        className="mr-3 cursor-pointer"
                        title="Edit"
                      >
                        <FaRegEdit size={24} className="text-blue-500" />
                      </Link>
                      <button
                        onClick={() => setIsDeleteData(employee?._id)}
                        title="Delete"
                        className="cursor-pointer"
                      >
                        <BiTrash size={24} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteData}
        onClose={() => setIsDeleteData(false)}
        onConfirm={() => {
          dispatch(deleteOneEmployee(isDeleteData));
          setIsDeleteData(false);
        }}
      />
    </div>
  );
}
