"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const VerifyLink = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams?.get("email") ?? null;
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {


        const verify = async (): Promise<void> => {
            if (!email) {
                router.push("/login");
                return;
            }

            setIsLoading(true)
            try {
                const res = await fetch(`/api/verify-link?email=${email}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await res.json();

                if (data.success) {
                    router.push("/dashboard");
                } else {
                    if (data.message?.server) {
                        toast.error(data.message?.server);
                    }
                }
            } catch (err) {
                toast.error("Something went wrong");
            } finally {
                setIsLoading(false)
            }
        };

        verify();


    }, [email, router]);

    return (
        <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
            {isLoading ? "Verifying link..." : "Redirecting..."}
        </div>
    );
};

export default VerifyLink;
