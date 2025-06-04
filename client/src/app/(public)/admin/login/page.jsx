"use client";

import { useEffect, useState } from "react";
import Inputbox from "@/components/Inputbox";
import Button from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, loginUser } from "@/redux/userSlice";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authChecked, setAuthChecked] = useState(false); // <--- replacing useRef

  const { isLoading, error, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!authChecked) {
      dispatch(checkAuth());
      setAuthChecked(true);
    }
  }, [authChecked, dispatch]);

  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  const handleLogin = async () => {
    const res = await dispatch(loginUser({ email, password }));
    if (res?.payload?.success) {
      if (res.payload.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
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
                <h3 className="text-slate-900 text-3xl font-semibold">Admin Login</h3>
              </div>

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
                placeholder="********"
                error={error?.password}
              />

              <div className="!mt-12">
                <Button
                  onClick={handleLogin}
                  label="Login"
                  loading={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="max-md:mt-8">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="login"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
