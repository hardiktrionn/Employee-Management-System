"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const Inputbox = dynamic(() => import("../../../components/Inputbox"));
const Button = dynamic(() => import("../../../components/Button"));

interface ErrorMessages {
  password?: string;
  newPassword?: string;
  confirmNewpassword?: string;
}

const ChangePassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewpassword, setConfirmNewpassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessages>({});

  const handleChangePassword = async () => {
    setIsLoading(true)
    setError({})
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, newPassword, confirmNewpassword }),
        credentials: "include"
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Password Are Change")
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
                value={confirmNewpassword}
                setValue={setConfirmNewpassword}
                placeholder="*******"
                error={error?.confirmNewpassword}
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
