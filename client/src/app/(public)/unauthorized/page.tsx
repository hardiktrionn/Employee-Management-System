"use client";

import Link from "next/link";

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-red-600">403 - Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-6">
        You don&apos;t have permission to access this page.
      </p>
      <Link href="/" passHref>
        <button className="px-6 py-2">Go to Home</button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
