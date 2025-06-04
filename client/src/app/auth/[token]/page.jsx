"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthHandler = ({ params }) => {
  const router = useRouter();
  const { token } = params;

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  return <p>Redirecting...</p>;
};

export default AuthHandler;
