"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Simulate logout logic
    console.log("User logged out");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Logout</h1>
        <p className="mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-center gap-4">
          <Button
            className="bg-red-500 hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Button
            className="bg-gray-500 hover:bg-gray-600"
            onClick={() => router.push("/")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
