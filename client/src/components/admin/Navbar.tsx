
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineSearch,
} from "react-icons/ai";
import { TbLogout2 } from "react-icons/tb";
import type { AppDispatch } from "../../lib/store"; // Update path as needed
import { setUser } from "../../redux/userSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const router=useRouter()

  // Admin Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("../../api/logout", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        dispatch(setUser(null))
        router.push("/admin/login");
      } else {
        if (data.message) {
          toast.error(data.message)
        }
      }
    } catch (err) { // Unexpected error handling
      console.log(err)
      toast.error("Something went wrong");
    }

  }
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-t from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl overflow-hidden rounded-b-[20px] py-2">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <AiOutlineClose className="w-6 h-6" />
              ) : (
                <AiOutlineMenu className="w-6 h-6" />
              )}
            </button>
            <div className="text-2xl sm:text-3xl font-bold italic bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Employee Management System
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search here"
                className="bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 px-4 py-2 rounded-xl w-64 lg:w-80 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
              />
              <AiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-200" />
            </div>
            <div className="relative hidden sm:block">
              <button
                onClick={handleLogout}
                className="group flex items-center justify-start w-8 h-8 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
              >
                <div className="w-full flex items-center justify-center transition-all duration-300 group-hover:justify-start group-hover:px-3">
                  <TbLogout2 size={20} className="cursor-pointer" />
                </div>
                <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
