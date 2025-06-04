"use client";

import Link from "next/link";
import {  TbLogout } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white w-full tracking-wide sticky top-0 z-50">
      <div className="flex items-center w-full relative">
        <Link href="/">
          <h1 className="font-bold text-3xl">Employee Management System</h1>
        </Link>
        <div className="ml-20 font-semibold text-lg flex space-x-8 items-center">
          {/* Example nav links (uncomment if needed): */}
          {/* <Link href="/leave-state" className="flex items-center space-x-1 cursor-pointer">
            <FaRegCalendarCheck />
            <span>Leave State</span>
          </Link>
          <Link href="/profile" className="flex items-center space-x-1 cursor-pointer">
            <FaRegUserCircle />
            <span>Profile</span>
          </Link> */}
          {/* <Link href="/dashboard" className="flex items-center space-x-1 cursor-pointer">
            <TbLayoutDashboard />
            <span>Dashboard</span>
          </Link> */}
        </div>
        {user && (
          <button
            onClick={() => dispatch(logoutUser())}
            className="absolute right-2 flex items-center font-semibold bg-gray-100 shadow-md border border-gray-200 px-2 rounded-lg py-1 cursor-pointer"
          >
            <TbLogout size={30} />
            <p>Logout</p>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
