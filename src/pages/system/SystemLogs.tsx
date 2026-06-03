import React, { useMemo, useState } from "react";

type LogLevel = "info" | "warning" | "error";

type Log = {
  id: number;
  level: LogLevel;
  message: string;
  date: string;
};

const SystemLogs: React.FC = () => {
  const [search, setSearch] = useState("");

  const [logs] = useState<Log[]>([
    {
      id: 1,
      level: "info",
      message: "User admin logged in",
      date: "2026-06-01 10:30",
    },
    {
      id: 2,
      level: "warning",
      message: "Ticket #123 not assigned",
      date: "2026-06-01 11:00",
    },
    {
      id: 3,
      level: "error",
      message: "Database connection failed",
      date: "2026-06-01 12:10",
    },
    {
      id: 4,
      level: "info",
      message: "New ticket created",
      date: "2026-06-02 09:15",
    },
  ]);

  const getBadgeClass = (level: LogLevel) => {
    switch (level) {
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) =>
      log.message.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, logs]);

  return (
    <div className="p-4">

      <h3 className="text-xl font-semibold mb-4">
        System Logs
      </h3>

      {/* SEARCH */}
      <div className="bg-white shadow rounded p-4 mb-4">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">

        <table className="w-full text-sm border">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Level</th>
              <th className="p-3">Message</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>

            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-3">{index + 1}</td>

                  {/* LEVEL */}
                  <td className="p-3">
                    <span
                      className={`text-white text-xs px-2 py-1 rounded ${getBadgeClass(
                        log.level
                      )}`}
                    >
                      {log.level.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-3">{log.message}</td>

                  <td className="p-3 text-gray-600">
                    {log.date}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-500"
                >
                  No logs found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default SystemLogs;