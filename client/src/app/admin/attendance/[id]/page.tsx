"use client";

import { use, useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import Link from "next/link";
import formatTime from "../../../../utils/formatTime";
import formatISODate from "../../../../utils/formatISODate";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const Button = dynamic(() => import("../../../../components/Button"));

interface AttendanceLog {
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: string | number;
}

interface AttendanceData {
  totalDays: number;
  totalHours: number;
  logs: AttendanceLog[];
}

interface Params {
  id?: string;
}

interface AuthHandlerProps {
  params: Promise<Params>
}


export default function AttendanceSlug({ params }: AuthHandlerProps) {
  const { id } = use(params);

  const [data, setData] = useState<AttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (id) {
      fetchAttendanceData();
    }
  }, [id]);

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`../../api/attendance/fetch/${id}?startDate=${selectionRange.startDate}&endDate=${selectionRange.endDate}`, {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json()

      if (data.success) {
        setData(data.data[0])
      } else {
        if (data?.message?.server) toast.error(data?.message.server);
      }
    } catch (error: any) {
      toast.error("Something wrong")
    } finally {
      setIsLoading(false)
    }
  };


  return (
    <div className="flex-1 py-10 px-4">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center text-sm text-gray-500">
          <AiOutlineHome className="w-4 h-4 mr-1" />
          <Link href={"/admin/dashboard"} className="cursor-pointer hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={"/admin/attendance"} className="cursor-pointer hover:underline">
            Attendance
          </Link>
          <span className="mx-2">/</span>
          <span className="text-purple-600 font-medium">{id}</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {/* Start Date Picker */}
            <input
              type="date"
              onChange={(e) =>
                setSelectionRange((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              max={new Date().toISOString().split("T")[0]}
              value={selectionRange.startDate}
              className="border px-2 py-1 rounded"
            />

            {/* End Date Picker */}
            <input
              type="date"
              onChange={(e) =>
                setSelectionRange((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              max={new Date().toISOString().split("T")[0]}
              value={selectionRange.endDate}
              className="border px-2 py-1 rounded"
            />

            {/* Fetch Button */}
            <Button onClick={fetchAttendanceData} label={"Search"} loading={isLoading} />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-6 my-2 mx-10">
          <div className="flex flex-col items-center p-4 rounded-xl border border-gray-200 shadow-md">
            <h1 className="text-black font-bold">Employee</h1>
            <span className="text-sm font-semibold">{id}</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl border border-gray-200 shadow-md">
            <h1 className="text-black font-bold">Total Working Days</h1>
            <span className="text-sm font-semibold">{data?.totalDays || 0}</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl border border-gray-200 shadow-md">
            <h1 className="text-black font-bold">Total Working Hours</h1>
            <span className="text-sm font-semibold">{data?.totalHours || 0}</span>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Working Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.logs?.map((item) => (
                <tr key={item.date} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium border rounded-md bg-blue-100 text-blue-800 border-blue-200">
                      {formatISODate(item.date)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatTime(item.checkInTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatTime(item.checkOutTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.workingHours}</td>
                </tr>
              )) ?? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      No attendance records found.
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
