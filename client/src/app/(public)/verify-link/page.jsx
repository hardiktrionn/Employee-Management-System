"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios"; // Adjust if your axios file path is different
import toast from "react-hot-toast";

const VerifyLink = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!email) {
        router.push("/login");
        return;
      }

      try {
        const res = await axiosInstance.get(`/auth/verify-link?email=${email}`);
        if (res.data.success) {
          router.push(`/new-password?email=${email}`);
        } else {
          toast.error(res.data.message || "Invalid or expired link.");
          router.push("/login");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message?.server || "Verification failed. Try again."
        );
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [email, router]);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
      {loading ? "Verifying link..." : "Redirecting..."}
    </div>
  );
};

export default VerifyLink;
