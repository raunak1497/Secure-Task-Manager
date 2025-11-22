// src/app/layout.tsx
import "./global.css";
import Navbar from "../components/Navbar";

// 🚫 DO NOT import useTheme or useAuth here
// 🚫 DO NOT make this a "use client" component

import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "TurboVets",
  description: "Task Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* BODY MUST NOT CHANGE BETWEEN SERVER AND CLIENT */}
      <body className="min-h-screen transition-colors bg-gray-100 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100">

        {/* ALL CLIENT LOGIC GOES INSIDE HERE */}
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <div className="mt-6 px-6">{children}</div>
          </AuthProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}