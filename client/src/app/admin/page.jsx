// app/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user?.role == "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  return <Loader />;
}
