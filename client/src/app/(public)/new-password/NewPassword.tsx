"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import Image from "next/image";

const Inputbox = dynamic(() => import("../../../components/Inputbox"));
const Button = dynamic(() => import("../../../components/Button"));

interface ErrorState {
  password?: string;
  confirmPassword?: string;
  server?: string;
}

const NewPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? null;

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState>({});

  const handleNewPassword = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword, email }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/login");
      } else {
        setError(data.message);
        if (data.message?.server) {
          toast.error(data.message?.server)
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false)
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="py-6 px-4">
     
          <div className="border border-slate-300 rounded-lg p-6 w-lg shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <div className="space-y-4">
              <div className="mb-12">
                <h3 className="text-slate-900 text-3xl font-semibold">Reset Password</h3>
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

    
      </div>
    </div>
  );
};

export default NewPassword;
