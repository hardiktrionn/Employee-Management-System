"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";
import Inputbox from "@/components/Inputbox";
import Button from "@/components/Button";

const NewPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  // User set new password
  const handleNewPassword = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(`/auth/new-password`, {
        email,
        password,
        confirmPassword,
      });

      if (res.data.success) {
        toast.success("Password changed successfully!");
        router.push("/login");
      }
    } catch (error) {
      const serverError = error.response?.data?.message?.server;
      const message =
        error.response?.data?.message || error.message || "Password reset failed.";
      toast.error(serverError || message);
      setError(typeof message === "object" ? message : {});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <div className="space-y-4">
              <div className="mb-12">
                <h3 className="text-slate-900 text-3xl font-semibold">
                  Reset Password
                </h3>
              </div>

              <Inputbox
                label="New Password"
                type="password"
                value={password}
                setValue={setPassword}
                placeholder="********"
                error={error?.password}
              />

              <Inputbox
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                placeholder="********"
                error={error?.confirmPassword}
              />

              <div className="!mt-7">
                <Button
                  onClick={handleNewPassword}
                  label="Reset Password"
                  loading={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="max-md:mt-8">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="login img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
