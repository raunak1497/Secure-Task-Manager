"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:3000/auth/register", {
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] transition">
      <div className="
        w-full max-w-md p-8 rounded-2xl shadow-xl
        bg-white dark:bg-[#1c2333]
        text-gray-900 dark:text-gray-100
        border border-gray-200 dark:border-gray-700
      ">

        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

        {error && (
          <p className="text-red-500 text-center mb-3 font-medium">
            {error}
          </p>
        )}

        <form onSubmit={register} className="space-y-4">
          <input
            className="w-full p-3 rounded-lg border bg-gray-100 dark:bg-[#2a3142]"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg border bg-gray-100 dark:bg-[#2a3142]"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-lg border bg-gray-100 dark:bg-[#2a3142]"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-green-600 hover:bg-green-700 
              dark:bg-green-500 dark:hover:bg-green-600
              text-white p-3 rounded-lg font-medium transition"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}