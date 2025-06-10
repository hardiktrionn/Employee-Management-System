"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axios";
import dynamic from "next/dynamic";
import { AxiosError } from "axios";
import Image from "next/image";

const Inputbox = dynamic(() => import("../../../components/Inputbox"));
const Button = dynamic(() => import("../../../components/Button"));

interface ErrorType {
  email?: string;
  [key: string]: any;
}

const ForgetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<ErrorType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    } catch (err) {
      setIsLoading(false);
      const error = err as AxiosError<any>;
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
     
          <div className="border border-slate-300 rounded-lg p-6 w-lg shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
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

      
      </div>
    </div>
  );
};

export default ForgetPassword;
