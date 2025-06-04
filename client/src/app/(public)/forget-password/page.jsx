"use client";

import Button from "@/components/Button";
import Inputbox from "@/components/Inputbox";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  // Forget the password
  const handleForgetPassword = async () => {
    setError({});
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/auth/forget-password", { email });
      setIsLoading(false);

      if (res.data.success) {
        toast.success(`Reset link sent to ${email}`);
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      setIsLoading(false);
      const message =
        error.response?.data?.message?.server ||
        error.response?.data?.message ||
        error.message ||
        "Request failed";

      if (typeof message === "string") {
        toast.error(message);
      } else {
        setError(message);
      }
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
                  Forget Password
                </h3>
              </div>

              <Inputbox
                label="Email"
                type="email"
                value={email}
                setValue={setEmail}
                placeholder="example@gmail.com"
                error={error?.email}
              />

              <div className="!mt-7">
                <Button
                  onClick={handleForgetPassword}
                  label="Send Reset Link"
                  loading={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="max-md:mt-8">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="Forget password"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
