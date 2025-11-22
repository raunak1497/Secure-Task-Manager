"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function Page() {
  return (
    <ProtectedRoute>
      <AuditLogPage />
    </ProtectedRoute>
  );
}

function AuditLogPage() {
  const { token, user } = useAuth();

  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (filterValue: string) => {
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:3000/audit-log?filter=${filterValue}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(filter);
  }, [filter]);

  // Only Owner/Admin can see UI
  const allowed = user?.role === "OWNER" || user?.role === "ADMIN";

  if (!allowed) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 text-xl">
        ❌ You are not authorized to view audit logs.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">Audit Log</h1>

      {/* FILTER DROPDOWN */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
          Filter logs:
        </label>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="
            px-3 py-2 rounded-lg border
            bg-gray-50 dark:bg-[#1d2433]
            border-gray-300 dark:border-gray-600
            dark:text-white shadow
            transition
          "
        >
          <option value="all">All</option>
          <option value="day">Last 24 hours</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
      </div>

      {/* LOADING STATE */}
      {loading && <p className="text-gray-600 dark:text-gray-300">Loading logs...</p>}

      {/* LOG TABLE */}
      {!loading && (
        <div className="overflow-x-auto border dark:border-gray-700 rounded-xl shadow">
          <table className="w-full text-left bg-white dark:bg-[#1a2030]">
            <thead className="bg-gray-200 dark:bg-[#232b3a]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-4 text-gray-500 dark:text-gray-400"
                  >
                    No logs available.
                  </td>
                </tr>
              )}

              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a3142] transition"
                >
                  <td className="p-3">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3">{log.userEmail}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-sm rounded text-white bg-blue-600">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3">{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}