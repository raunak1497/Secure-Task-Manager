"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ProfilePage() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      const res = await axios.get("http://localhost:3000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(res.data);
    };

    fetchProfile();
  }, [token]);

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center mt-10">
        <div className="
          w-full max-w-2xl p-10 rounded-2xl shadow-lg
          bg-white dark:bg-[#1c2333]
          text-gray-900 dark:text-gray-100
        ">
          <h1 className="text-3xl font-bold text-center mb-8">Your Profile</h1>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-lg font-medium">{profile.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-lg font-medium">{profile.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm uppercase">
                {profile.role}
              </span>
            </div>
          </div>

          <p className="text-center text-xs mt-10 opacity-60">
            TurboVets • Profile Information
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}