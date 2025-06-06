"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Params {
  token?: string;
}

interface AuthHandlerProps {
  params: Promise<Params>
}

const AuthHandler: React.FC<AuthHandlerProps> = ({ params }) => {
  const router = useRouter();
  const token = use(params)

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  return <p>Redirecting...</p>;
};

export default AuthHandler;
