"use client";
// this is login component
import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Inputbox = dynamic(() => import("../../../../components/Inputbox"));
const Button = dynamic(() => import("../../../../components/Button"));

// manage the error is other key edit to give an error
interface Error {
  email?: string;
  password?: string;
  server?: string;
}

const LoginAdmin = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<Error>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Admin can login throw a email and password
   * if the succefully login to redirect dashboard
   * if the user are not valid to receive error message
   */
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Login Succefully");
        router.push("/admin/dashboard");
      } else {
        // Show validation errors or server error toast
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="py-6 px-4">
        <div className="border border-slate-300 rounded-lg p-6 w-lg shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
          <div className="space-y-4">
            <div className="mb-12">
              <h3 className="text-slate-900 text-3xl font-semibold">Login</h3>
            </div>

            <Inputbox
              label={"Email"}
              type="email"
              value={email}
              setValue={setEmail}
              placeholder="example@gmail.com"
              error={error?.email}
            />
            <Inputbox
              label={"Password"}
              type="password"
              value={password}
              setValue={setPassword}
              placeholder="*******"
              error={error?.password}
            />

            <div className="!mt-12">
              <Button
                onClick={handleLogin}
                label={"Login"}
                loading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
