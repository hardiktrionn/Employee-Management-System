"use client";

import { AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TableSkeleton from "@/components/skelton/TableSkeleton";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";

interface EmployeeData {
  employeeId: string;
  name: string;
  email: string;
  profile?: string;
  totalDays?: number;
  totalHours?: number;
}


export default function Attendance() {
  const [data, setData] = useState<EmployeeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  /**
   * all user attendance fetch
   * all user attendance are receive with total day and working hours
   */
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/attendance/fetch-all`, {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json()

        if (data.success) {
          setData(data.data)
        } else {
          if (data?.message?.server) toast.error(data?.message.server);
        }
      } catch (error: any) {

        toast.error("Something wrong")
      } finally {
        setIsLoading(false)
      }
    };

    fetchAttendanceData();
  }, []);


  // if data are fetching stage to see Loader
  if (isLoading)return <TableSkeleton/>
  return (
    <div className="flex-1 w-full p-4 sm:p-6 lg:ml-0">
      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="text-lg font-medium text-gray-900">{data.length} People</div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search here"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
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
                  Total Working Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avr. Working Hours
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="w-8 h-8">
                      <AvatarImage
                      
                        className="h-8 w-8 rounded-full"
                        src={item?.profile || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                        alt={"img"}
                      />
                      </Avatar>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{item?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md border bg-green-100 text-green-800 border-green-200">
                      {item?.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium border rounded-md bg-blue-100 text-blue-800 border-blue-200">
                      {item?.employeeId}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">{item?.totalDays ?? "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item?.totalHours ?? "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Link
                        href={`/admin/attendance/${item?.employeeId}`}
                        className="mr-3 cursor-pointer"
                        title="View"
                      >
                        <AiOutlineEye size={24} className="text-blue-500" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
