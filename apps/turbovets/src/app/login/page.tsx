"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;

      // decode user from JWT
      const payload = JSON.parse(atob(token.split(".")[1]));

      const userData = {
        email: payload.email,
        role: payload.role,
        name: payload.name,
      };

      // Save in AuthContext (IMPORTANT)
      login(token, userData);

      router.push("/tasks");

    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-xl bg-white dark:bg-[#1c2333]">
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>

        {error && (
          <p className="text-red-500 text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="
                w-full p-3 rounded-lg border
                bg-gray-50 dark:bg-[#2f3545]
                border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2
                focus:ring-blue-500 dark:focus:ring-blue-400
                transition
            "
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            type="password"
            className="
                w-full p-3 rounded-lg border
                bg-gray-50 dark:bg-[#2f3545]
                border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2
                focus:ring-blue-500 dark:focus:ring-blue-400
                transition
            "
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg">
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}