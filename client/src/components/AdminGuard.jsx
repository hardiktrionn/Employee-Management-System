"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "@/redux/userSlice";
import Loader from "./Loader";
import { fetchAllEmplyoee } from "@/redux/adminSlice";

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.user);

  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const verifyAuth = async () => {
      if (!user && !checked) {
        await dispatch(checkAuth());
        setChecked(true);
      } else {
        setChecked(true);
      }
    };
    verifyAuth();
  }, [dispatch, user]);

  useEffect(() => {
    if (user && user?.role != "admin") {
      router.push("/unauthorized");
    }else{
      dispatch(fetchAllEmplyoee())
    }
    if (checked && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [checked, user, pathname, router]);

  if (isLoading || !user || !checked) return <Loader />;

  return <>{children}</>;
};

export default AuthGuard;
