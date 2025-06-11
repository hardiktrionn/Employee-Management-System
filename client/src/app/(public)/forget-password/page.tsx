"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const Inputbox = dynamic(() => import("../../../components/Inputbox"));
const Button = dynamic(() => import("../../../components/Button"));

// manage the error is other key edit to give an error
interface ErrorType {
  email?: string;
  [key: string]: any;
}

const ForgetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<ErrorType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * user can forget thief password throw a email
   * when response is success to receive a link in the email to validate and change thier password
   */
  const handleForgetPassword = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: email,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        setError(data.message);
        if (data.message?.server) {
          toast.error(data.message?.server);
        }
      }
    } catch (err) { // Unexpected error handling
      // Unexpected error handling

      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
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
