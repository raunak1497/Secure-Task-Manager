"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";

function TaskDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [task, setTask] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // NEW: Local state for status before saving
  const [newStatus, setNewStatus] = useState<string>("");

  const canModify = user?.role === "OWNER" || user?.role === "ADMIN";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    fetchTask();
  }, [mounted]);

  const fetchTask = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`http://localhost:3000/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTask(res.data);
    setNewStatus(res.data.status); // new: initialize dropdown
  };

  // NEW: Save Status only when clicking "Save"
  const saveStatus = async () => {
    if (!canModify) return;

    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:3000/tasks/${id}`,
      {
        title: task.title,
        description: task.description,
        status: newStatus,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 👉 Redirect back to tasks page
    router.push("/tasks");
  };

  const deleteTask = async () => {
    if (!canModify) return;

    if (!confirm("Are you sure you want to delete this task?")) return;

    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:3000/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    router.push("/tasks");
  };

  if (!mounted || !task) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* USER ROLE BADGE */}
      {user && (
        <div className="mb-4">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Logged in as:
          </span>{" "}
          <span
            className="px-2 py-1 rounded text-white text-sm ml-2 shadow-sm"
            style={{
              background:
                user.role === "OWNER"
                  ? "#2563eb"
                  : user.role === "Admin"
                  ? "#16a34a"
                  : "#6b7280",
            }}
          >
            {user.role}
          </span>
        </div>
      )}

      {/* CARD */}
      <div
        className="
          bg-white dark:bg-[#1c2333]
          border border-gray-200 dark:border-gray-700
          rounded-xl shadow-lg p-6
          transition-colors
        "
      >
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {task.title}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {task.description}
        </p>

        {/* STATUS SELECT + SAVE BUTTON */}
        {canModify && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Status:
            </label>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="
                border px-3 py-2 rounded-lg w-full
                bg-gray-50 dark:bg-[#2a3142]
                text-gray-900 dark:text-white
                border-gray-300 dark:border-gray-600
                shadow-sm
              "
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* SAVE BUTTON */}
            <button
              onClick={saveStatus}
              className="
                mt-3 bg-green-600 hover:bg-green-700
                text-white px-4 py-2 rounded-lg
                shadow-sm transition
              "
            >
              Save Status
            </button>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-3 mt-8">
          {canModify && (
            <Link
              href={`/tasks/${id}/edit`}
              className="
                bg-blue-600 hover:bg-blue-700
                text-white px-4 py-2 rounded-lg
                shadow-sm transition
              "
            >
              Edit
            </Link>
          )}

          {canModify && (
            <button
              onClick={deleteTask}
              className="
                bg-red-600 hover:bg-red-700
                text-white px-4 py-2 rounded-lg
                shadow-sm transition
              "
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <TaskDetails />
    </ProtectedRoute>
  );
}