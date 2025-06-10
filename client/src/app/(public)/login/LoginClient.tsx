"use client";

import { useState } from "react";
import TwoStepauth from "../../../components/TwoStepauth";
import Link from "next/link";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Inputbox = dynamic(() => import("../../../components/Inputbox"));
const Button = dynamic(() => import("../../../components/Button"));

interface Error {
    email?: string
    password?: string
    server?: string
}
const LoginClient = () => {

    const router = useRouter()
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isMfaAuth, setIsMfaAuth] = useState<boolean>(false);
    const [error, setError] = useState<Error>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const googleLogin = () => {
        window.open(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/google`, "_self");
    };

    const facebookLogin = () => {
        window.open(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/facebook`, "_self");
    };

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                if (data.mfaRequired) {
                    setIsMfaAuth(true)

                } else {
                    toast.success("Login Succefully")
                    router.push("/dashboard");
                }
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
            {!isMfaAuth ? (
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

                            <div className="flex flex-wrap items-center justify-end gap-4">
                                <div className="text-sm">
                                    <Link
                                        href="/forget-password"
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>

                            <div className="!mt-12">
                                <Button
                                    onClick={handleLogin}
                                    label={"Login"}
                                    loading={isLoading}
                                />
                                <div className="my-4 flex items-center gap-4">
                                    <hr className="w-full border-slate-300" />
                                    <p className="text-sm text-slate-800 text-center">or</p>
                                    <hr className="w-full border-slate-300" />
                                </div>

                                <div className="space-x-6 flex justify-center">

                                    <button onClick={googleLogin}
                                        className="border-0 outline-0 cursor-pointer  disabled:cursor-no-drop" disabled={isLoading}>
                                        <FcGoogle size={30} />
                                    </button>
                                    <button onClick={facebookLogin}
                                        className="border-0 outline-0 cursor-pointer disabled:cursor-no-drop" disabled={isLoading}>
                                        <FaFacebook size={30} className="bg-white text-blue-600" />
                                    </button>
                                </div>

                                <p className="text-sm !mt-6 text-center text-slate-500">
                                    Don&apos;t have an account
                                    <Link
                                        href="/register"
                                        className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap"
                                    >
                                        Register here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>



                </div>
            ) : (
                <TwoStepauth email={email} />
            )}
        </div>
    );
};

export default LoginClient;
