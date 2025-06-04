"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "@/redux/userSlice";

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(checkAuth());
    }
  }, [dispatch, pathname]);

  useEffect(() => {
    if (!user && !isLoading && pathname !== "/login") {
      router.push("/login");
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) return <p>Loading...</p>;

  return <>{children}</>;
};

export default AuthGuard;
