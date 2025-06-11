"use client";

import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import formatISODate from "../../../utils/formatISODate";
import { FaRegEdit } from "react-icons/fa";
import DeleteModal from "../../../components/DeleteConfirmationModal";
import { BiTrash } from "react-icons/bi";
import Link from "next/link";
import type { AppDispatch, RootState } from "../../../lib/store";
import toast from "react-hot-toast";
import { setEmployee } from "../../../redux/adminSlice";
import Image from "next/image";
import TableSkeleton from "@/components/skelton/TableSkeleton";

// interfaces
interface Employee {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  joiningDate: string;
  profilePhoto?: string;
}

export default function EmployeeDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const { employee } = useSelector((state: RootState) => state.admin);
  const [isDeleteData, setIsDeleteData] = useState<boolean | string>(false);
  const [isDeletingData, setIsDeletingData] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<Employee[]>([]);
  const [allEmployee, setAllEmployee] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // fetch all employee
  useEffect(() => {
    const fetchAllEmplyoee = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const res = await fetch(`../api/employee/fetch-all`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setData(data.data);
          dispatch(setEmployee(data.data));
        } else {
          if (data?.message?.server) toast.error(data?.message.server);
        }
      } catch (error: any) {
        toast.error("Something wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllEmplyoee();
  }, [dispatch]);

  // filter the data according search with some delay
  useEffect(() => {
    const time = setTimeout(() => {
      if (allEmployee.length) {
        const res = allEmployee.filter(
          (a) =>
            a?.name.toLowerCase().includes(search.toLowerCase()) ||
            a?.email.toLowerCase().includes(search.toLowerCase()) ||
            a?.employeeId.toLowerCase().includes(search.toLowerCase())
        );
        setData(res);
      }
    }, 300);

    return () => clearTimeout(time);
  }, [search, allEmployee]);

  // Delete the employee
  const deleteOneEmployee = async () => {
    if (isDeleteData) {
      try {
        setIsDeletingData(true);
        const res = await fetch(`../api/employee/delete/${isDeleteData}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          let filter = employee.filter((item) => item._id != data.id);
          setAllEmployee(filter);
          toast.success(data.message);
          dispatch(setEmployee(filter));
        } else {
          if (data?.message?.server) toast.error(data?.message.server);
        }
      } catch (error: any) {
        console.log(error);
        toast.error("Something wrong");
      } finally {
        setIsDeletingData(false);
        setIsDeleteData(false);
      }
    }
  };

  // data are loading stage to see the loader
  if (isLoading) return <TableSkeleton />;

  return (
    <div className="flex-1 w-full p-4 sm:p-6 lg:ml-0">
      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="text-lg font-medium text-gray-900">
            {allEmployee.length} People
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search here"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border-2 border-gray-300 text-black px-4 py-2 rounded-xl w-64 lg:w-80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              />
              <AiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
            </div>
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
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image
                        height={80}
                        width={80}
                        className="h-8 w-8 rounded-full"
                        src={item.profilePhoto || "/placeholder.svg"}
                        alt={"img"}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md border bg-green-100 text-green-800 border-green-200">
                      {item.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium border rounded-md bg-blue-100 text-blue-800 border-blue-200">
                      {item.employeeId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatISODate(item.joiningDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Link
                        href={`/admin/employee/${item._id}`}
                        className="mr-3 cursor-pointer"
                        title="Edit"
                      >
                        <FaRegEdit size={24} className="text-blue-500" />
                      </Link>
                      <button
                        onClick={() => setIsDeleteData(item._id)}
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
        isOpen={!!isDeleteData}
        onClose={() => setIsDeleteData(false)}
        isDeletingData={isDeletingData}
        onConfirm={deleteOneEmployee}
      />
    </div>
  );
}
