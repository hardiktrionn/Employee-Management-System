"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axios"; // Ensure this is configured properly
import Inputbox from "@/components/Inputbox";
import Button from "@/components/Button";
import toast from "react-hot-toast";

const TwoStepauth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Pass ?email=user@example.com in URL

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (!email) {
      toast.error("No email provided for verification.");
      router.push("/login");
    }
  }, [email, router]);

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/mfaVerification", {
        otp,
        email,
      });

      setIsLoading(false);
      if (res.data.success) {
        toast.success("OTP verified successfully");
        router.push("/");
      }
    } catch (err) {
      setIsLoading(false);
      const message = err.response?.data?.message;
      if (message?.server) {
        toast.error(message.server);
      }
      setError(message || {});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="border border-slate-300 rounded-lg p-6 w-full max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)]">
        <div className="space-y-4">
          <h3 className="text-slate-900 text-3xl font-semibold mb-6">
            2-Step Authentication
          </h3>

          <Inputbox
            label="OTP"
            type="text"
            value={otp}
            setValue={setOtp}
            placeholder="Enter your 6-digit code"
            error={error?.otp}
          />

          <div className="!mt-8">
            <Button
              onClick={handleVerify}
              label="Verify"
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoStepauth;
