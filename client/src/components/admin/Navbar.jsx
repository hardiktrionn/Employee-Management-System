"use client";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
