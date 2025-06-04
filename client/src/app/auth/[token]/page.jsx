"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthHandler = ({ params }) => {
  const router = useRouter();

  // ✅ Safely unwrap params.token using React.use()
  const { token } = use(params);

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  return <p>Redirecting...</p>;
};

export default AuthHandler;
