"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { token, logout, user } = useAuth();   // ✅ FIX: added user
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <nav
      className="
        w-full px-6 py-4 flex justify-between items-center 
        bg-white dark:bg-[#111827] text-black dark:text-white shadow-md
      "
    >
      {/* LOGO */}
      <Link href="/tasks" className="text-xl font-bold">
        TurboVets
      </Link>

      {/* RIGHT SIDE ITEMS */}
      <div className="flex items-center gap-4">

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-full bg-gray-200 dark:bg-white/10"
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        {/* LOGS BUTTON (OWNER + ADMIN ONLY) */}
        {user && (user.role === "OWNER" || user.role === "ADMIN") && (
          <Link
            href="/audit-log"
            className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Logs
          </Link>
        )}

        {/* PROFILE + LOGOUT (only when logged in and not on login/register pages) */}
        {!isAuthPage && token && (
          <>
            <Link
              href="/profile"
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Profile
            </Link>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}