"use client";

import ProtectedRoute from "../../../../components/ProtectedRoute";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";

function EditTaskForm() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [task, setTask] = useState<any>(null);

  // Only Owner/Admin can edit
  const canEdit = user?.role === "OWNER" || user?.role === "ADMIN";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !canEdit) return;
    loadTask();
  }, [mounted, canEdit]);

  const loadTask = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`http://localhost:3000/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTask(res.data);
  };

  const save = async () => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:3000/tasks/${id}`,
      { title: task.title, description: task.description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    router.push(`/tasks/${id}`);
  };

  if (!mounted) return null;

  if (!canEdit)
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 text-xl">
        ❌ You do not have permission to edit tasks.
      </div>
    );

  if (!task) return null;

  return (
    <div className="p-6 flex justify-center">
      <div
        className="
          w-full max-w-xl 
          bg-white dark:bg-[#1c2333] 
          border border-gray-200 dark:border-gray-700 
          shadow-xl rounded-xl 
          p-8 
          transition-colors
        "
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Edit Task
        </h1>

        {/* TITLE */}
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          className="
            w-full p-3 rounded-lg mb-4 mt-1 
            border border-gray-300 dark:border-gray-600
            bg-gray-100 dark:bg-[#2a3142]
            text-gray-900 dark:text-white
          "
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />

        {/* DESCRIPTION */}
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          className="
            w-full p-3 rounded-lg mb-4 mt-1 
            border border-gray-300 dark:border-gray-600
            bg-gray-100 dark:bg-[#2a3142]
            text-gray-900 dark:text-white
            min-h-[120px]
          "
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />

        {/* BUTTON */}
        <button
          onClick={save}
          className="
            w-full bg-blue-600 hover:bg-blue-700 
            text-white py-3 rounded-lg 
            shadow-md transition
          "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <EditTaskForm />
    </ProtectedRoute>
  );
}