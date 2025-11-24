"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function Page() {
  return (
    <ProtectedRoute>
      <TaskBoard />
    </ProtectedRoute>
  );
}

function TaskBoard() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<any>(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    const canModify = user?.role === "OWNER" || user?.role === "ADMIN";
    if (!canModify) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await axios.put(
        `http://localhost:3000/tasks/${taskId}`,
        {
          title: task.title,
          description: task.description,
          status: newStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update status", err);
      // If backend fails, revert
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
      );
    }
  };

  const onDragStart = (task: any) => {
    setDragging(task);
  };

  const onDrop = (newStatus: string) => {
    if (!dragging) return;
    if ((dragging.status ?? "Pending") === newStatus) return;

    updateTaskStatus(dragging.id, newStatus);
    setDragging(null);
  };

  const getTasks = (status: string) =>
    tasks.filter((task) => (task.status ?? "Pending") === status);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ---------- TOP BAR ---------- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">TurboVets Tasks</h1>

          <div className="mt-2">
            <span className="font-semibold">Logged in as:</span>{" "}
            <span className="ml-2 px-2 py-1 text-white rounded bg-blue-600 text-sm">
              {user?.role}
            </span>
          </div>
        </div>

        {/* CREATE TASK BUTTON (Right aligned) */}
        {user && user.role !== "VIEWER" && (
          <Link
            href="/tasks/create"
            className="bg-green-600 text-white px-5 py-2 rounded-lg 
                       hover:bg-green-700 transition shadow"
          >
            + Create Task
          </Link>
        )}
      </div>

      {/* ---------- KANBAN BOARD ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn
          title="Pending"
          status="Pending"
          tasks={getTasks("Pending")}
          onDrop={onDrop}
          onDragStart={onDragStart}
        />

        <KanbanColumn
          title="In Progress"
          status="In Progress"
          tasks={getTasks("In Progress")}
          onDrop={onDrop}
          onDragStart={onDragStart}
        />

        <KanbanColumn
          title="Completed"
          status="Completed"
          tasks={getTasks("Completed")}
          onDrop={onDrop}
          onDragStart={onDragStart}
        />
      </div>
    </div>
  );
}

function KanbanColumn({
  title,
  status,
  tasks,
  onDrop,
  onDragStart,
}: {
  title: string;
  status: string;
  tasks: any[];
  onDrop: (status: string) => void;
  onDragStart: (task: any) => void;
}) {
  return (
    <div
      className="p-4 rounded-lg border border-gray-600 bg-[#111827]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(status)}
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="space-y-4 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, onDragStart }: { task: any; onDragStart: (task: any) => void }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation();      // prevent Link from hijacking drag
        onDragStart(task);
      }}
      className="p-4 rounded-xl border shadow-sm cursor-grab
        bg-white dark:bg-[#1d2433]
        border-gray-300 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-[#242b3a]
        transition"
    >
      <div className="flex justify-between items-start">

        {/* CONTENT — not draggable */}
        <div
          onClick={(e) => {
            if (e.defaultPrevented) return;
          }}
          className="flex-1"
        >
          <Link href={`/tasks/${task.id}`}>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {task.description}
            </p>
          </Link>
        </div>

        {/* DRAG HANDLE — this area is safe to grab */}
        <div
          className="drag-handle text-xl px-2 select-none cursor-grab"
          title="Drag to move"
          onMouseDown={(e) => e.stopPropagation()}     // fix accidental clicks
          onClick={(e) => e.preventDefault()}         // prevent Link navigation on drag
        >
          ⋮⋮
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <span
          className={`px-2 py-1 text-xs rounded text-white ${
            task.status === "Pending"
              ? "bg-yellow-600"
              : task.status === "In Progress"
              ? "bg-blue-600"
              : "bg-green-600"
          }`}
        >
          {task.status}
        </span>
      </div>
    </div>
  );
}