"use client";

import "./global.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <div className="mt-6 px-6">{children}</div>
    </AuthProvider>
  );
}