"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../lib/store";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { setUser } from "../../../redux/userSlice";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { signIn } from "next-auth/react";

const Inputbox = dynamic(() => import("../../../components/Inputbox"));
const Button = dynamic(() => import("../../../components/Button"));

interface Error {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  server?: string;
}

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<Error>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * user register throw a name,email,password
   * after they register and redirect the dashboard page
   */
  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, confirmPassword }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Successfully Register");
        dispatch(setUser(data.user));
        router.push("/dashboard");
      } else {
        setError(data.message);
        if (data.message?.server) {
          toast.error(data.message?.server);
        }
      }
    } catch (err) {
      // Unexpected error handling
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="py-6 px-4">
        <div className="border border-slate-300 rounded-lg p-6 w-lg shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
          <div className="space-y-6">
            <h3 className="text-slate-900 text-3xl font-semibold mb-12">
              Register
            </h3>

            <Inputbox
              label="Name"
              value={name}
              setValue={setName}
              placeholder="Your Name"
              error={error?.name}
            />
            <Inputbox
              label="Email"
              type="email"
              value={email}
              setValue={setEmail}
              placeholder="example@gmail.com"
              error={error?.email}
            />
            <Inputbox
              label="Password"
              type="password"
              value={password}
              setValue={setPassword}
              placeholder="*******"
              error={error?.password}
            />
            <Inputbox
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              placeholder="*******"
              error={error?.confirmPassword}
            />

            <div className="mt-2">
              <Button
                onClick={handleRegister}
                label="Register"
                loading={isLoading}
              />

              <div className="my-4 flex items-center gap-4">
                <hr className="w-full border-slate-300" />
                <p className="text-sm text-slate-800 text-center">or</p>
                <hr className="w-full border-slate-300" />
              </div>

              <div className="space-x-6 flex justify-center">
                <button
                  onClick={() => signIn("google")}
                  className="border-0 outline-0 cursor-pointer  disabled:cursor-no-drop"
                  disabled={isLoading}
                >
                  <FcGoogle size={30} />
                </button>
                <button
                  onClick={() => signIn("facebook")}
                  className="border-0 outline-0 cursor-pointer disabled:cursor-no-drop"
                  disabled={isLoading}
                >
                  <FaFacebook size={30} className="bg-white text-blue-600" />
                </button>
              </div>

              <p className="text-sm mt-6 text-center text-slate-500">
                Already have an account?
                <span
                  onClick={() => router.push("/login")}
                  className="text-blue-600 font-medium hover:underline ml-1 cursor-pointer"
                >
                  Login here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
