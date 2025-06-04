"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaSquareFacebook } from "react-icons/fa6";
import Inputbox from "@/components/Inputbox";
import Button from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, registerUser } from "@/redux/userSlice";

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLoading, error, user } = useSelector((state) => state.user);

  const googleLogin = () => {
    window.open(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/google`, "_self");
  };

  const facebookLogin = () => {
    window.open(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/facebook`, "_self");
  };

  const handleRegister = async () => {
    dispatch(registerUser({ name, email, password, confirmPassword }));
  };

  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
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
                  <Button
                    onClick={googleLogin}
                    color={false}
                    loading={isLoading}
                    label={
                      <div className="flex items-center justify-center w-full">
                        <FcGoogle size={22} className="mr-2" />
                        Google
                      </div>
                    }
                  />
                  <Button
                    onClick={facebookLogin}
                    color={false}
                    loading={isLoading}
                    label={
                      <div className="flex items-center justify-center w-full">
                        <FaSquareFacebook
                          size={22}
                          className="mr-2 text-blue-600 bg-white"
                        />
                        Facebook
                      </div>
                    }
                  />
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

          <div className="max-md:mt-8">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="register"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
