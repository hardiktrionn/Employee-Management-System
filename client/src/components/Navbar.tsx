
import Link from "next/link";
import { TbLayoutDashboard, TbLogout } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import type { AppDispatch, RootState } from "../lib/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        router.push("/login");
        dispatch(setUser(null))
      } else {
        if (data.message) {
          toast.error(data.message)
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    }

  }
  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white w-full tracking-wide sticky top-0 z-50">
      <div className="flex items-center w-full relative">
        <Link href="/dashboard">
          <h1 className="font-bold text-3xl cursor-pointer">
            Employee Management System
          </h1>
        </Link>
        <div className="ml-20 font-semibold text-lg flex space-x-8 items-center">
          <Link href="/dashboard" className="flex items-center space-x-1 cursor-pointer">
            <TbLayoutDashboard />
            <span>Dashboard</span>
          </Link>
          <Link href="/profile" className="flex items-center space-x-1 cursor-pointer">
            <FaRegUserCircle />
            <span>Profile</span>
          </Link>
        </div>
        {user && (
          <button
            onClick={handleLogout}
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
