"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import type { RootState } from "../../lib/store"; // Adjust the import path accordingly

export default function Home() {
  const router = useRouter();

  // Define the user type according to your state shape
  interface User {
    role?: string;
    // add more fields if needed
  }

  const user = useSelector((state: RootState) => state.user.user) as User | null;

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/admin/login");
      }
    }
  }, [router, user]);

  return <Loader />;
}
