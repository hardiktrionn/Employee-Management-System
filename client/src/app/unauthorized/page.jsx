"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // optional, if you're using a design system

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-red-600">403 - Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-6">
        You don't have permission to access this page.
      </p>
      <Link href="/">
        <Button className="px-6 py-2">Go to Home</Button>
      </Link>
    </div>
  );
}
