"use client";

import { signOut } from "next-auth/react";
import { clearServiceWorkerCache } from "@/lib/clearCache";

export default function LogoutButton() {
    const handleLogout = async () => {
        await clearServiceWorkerCache();
        signOut({ callbackUrl: "/login" });
    };

    return (
        <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
            Logout
        </button>
    );
}











