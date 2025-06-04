"use client";

import { useState } from "react";
import Inputbox from "@/components/Inputbox";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewpassowrd, setConfirmNewpassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const router = useRouter();

  // Update User old password
  const handleChangePassword = async () => {
    try {
      setError({});
      setIsLoading(true);
      const res = await axiosInstance.post("/auth/change-password", {
        password,
        newPassword,
        confirmNewpassowrd,
      });

      setIsLoading(false);
      if (res.data.success) {
        toast.success("Password Changed");
        router.push("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.message?.server) {
        toast.error(error.response.data.message.server);
      } else {
        const message = error.response?.data?.message || {};
        setError(message);
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <div className="space-y-4">
              <div className="mb-12">
                <h3 className="text-slate-900 text-3xl font-semibold">
                  Change Password
                </h3>
              </div>

              <Inputbox
                label="Password"
                type="password"
                value={password}
                setValue={setPassword}
                placeholder="*******"
                error={error?.password}
              />
              <Inputbox
                label="New Password"
                type="password"
                value={newPassword}
                setValue={setNewPassword}
                placeholder="*******"
                error={error?.newPassword}
              />
              <Inputbox
                label="Confirm New Password"
                type="password"
                value={confirmNewpassowrd}
                setValue={setConfirmNewpassword}
                placeholder="*******"
                error={error?.confirmNewpassowrd}
              />

              <div className="!mt-12">
                <Button
                  onClick={handleChangePassword}
                  label="Change Password"
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

export default ChangePassword;
