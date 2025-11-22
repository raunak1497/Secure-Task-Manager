"use client";

import ProtectedRoute from "../../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

function CreateTaskForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // VIEWER SHOULD NOT CREATE TASKS
  if (user?.role === "Viewer") {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center bg-white dark:bg-[#1c2333] text-gray-900 dark:text-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            ❌ You are not authorized to create tasks.
          </h2>
        </div>
      </div>
    );
  }

  const createTask = async () => {
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3000/tasks",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push("/tasks");
    } catch (e) {
      console.error(e);
      setError("Failed to create task. Please try again.");
    }
  };

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
          Create New Task
        </h1>

        {error && (
          <p className="mb-4 text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        )}

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
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* DESCRIPTION */}
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          className="
            w-full p-3 rounded-lg mb-6 mt-1
            border border-gray-300 dark:border-gray-600
            bg-gray-100 dark:bg-[#2a3142]
            text-gray-900 dark:text-white 
            min-h-[120px]
          "
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* CREATE BUTTON */}
        <button
          onClick={createTask}
          className="
            w-full bg-green-600 hover:bg-green-700
            text-white py-3 rounded-lg 
            shadow-md transition
          "
        >
          Create Task
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <CreateTaskForm />
    </ProtectedRoute>
  );
}