// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store"; 
import Loader from "../components/Loader";

export default function Home() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  // check user are login or not if
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return <Loader />;
}
