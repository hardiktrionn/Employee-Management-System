"use client";

import { useCallback, useEffect, useState } from "react";
import formatISODate from "../../../utils/formatISODate";
import formatTime from "../../../utils/formatTime";
import toast from "react-hot-toast";
import { AiOutlineSearch } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/store";
import Button from "../../../components/Button";

// Define Attendance type
interface AttendanceLog {
  date: string;
  workingHours: number;
  checkInTime: string;
  checkOutTime: string;
  breakInTime: string;
  breakOutTime: string;
}

interface Attendance {
  _id: string;
  totalDays: number;
  totalHours: number;
  logs: AttendanceLog[];
}

const AttendancePage = () => {
  const [data, setData] = useState<Attendance | undefined>();
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);

  const startOfMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;
  const [selectionRange, setSelectionRange] = useState({
    startDate: startOfMonth,
    endDate: new Date().toISOString().split("T")[0],
  });

  const fetchAttendanceData = useCallback(async () => {
    if (!user?.employeeId) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/attendance/fetch/${user.employeeId}?startDate=${selectionRange.startDate}&endDate=${selectionRange.endDate}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();
      if (result.success) {
        setData(result.data[0]);
      } else {
        if (result?.message?.server) toast.error(result?.message.server);
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [user?.employeeId, selectionRange.startDate, selectionRange.endDate]);

  useEffect(() => {
    if (user) {
      fetchAttendanceData();
    }
  }, [user, fetchAttendanceData]);

  const handleAction = async (endpoint: string, successMessage: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/attendance/action${endpoint}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();
      if (result.success) {
        toast.success(successMessage);
        await fetchAttendanceData();
      } else {
        if (result?.message?.server) toast.error(result?.message.server);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = data?.logs.filter((item) =>
    formatISODate(item.date).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-wrap gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by date"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border-2 border-gray-300 text-black px-4 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              />
              <AiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
            </div>
            {[
              { label: "Check In", endpoint: "/check-in" },
              { label: "Check Out", endpoint: "/check-out" },
              { label: "Break In", endpoint: "/break-in" },
              { label: "Break Out", endpoint: "/break-out" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => handleAction(action.endpoint, `${action.label} successfully`)}
                disabled={isLoading}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                <FiPlus className="w-4 h-4" />
                <span>{isLoading ? `${action.label}...` : action.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
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

              <Button onClick={fetchAttendanceData} label={"Search"} loading={isLoading} />
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-3 gap-6 my-2 mx-10">
          <div className="flex flex-col items-center p-4 rounded-xl border border-gray-200 shadow-md">
            <h1 className="text-black font-bold">Name</h1>
            <span className="text-sm font-semibold">{user?.name}</span>
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
                {["Date", "Check In", "Break In", "Break Out", "Check Out", "Working Hours"].map((heading) => (
                  <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData?.map((item) => (
                <tr key={item.date} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatISODate(item.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTime(item.checkInTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTime(item.breakInTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTime(item.breakOutTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTime(item.checkOutTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.workingHours ? `${item.workingHours} hrs` : "0 hrs"}</td>
                </tr>
              ))}
              {filteredData?.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center px-6 py-4 text-gray-500">
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
};

export default AttendancePage;
