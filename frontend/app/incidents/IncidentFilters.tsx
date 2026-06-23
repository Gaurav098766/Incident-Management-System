"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { Severity, Status } from "@/lib/types";

interface Props {
  currentSeverity?: Severity;
  currentStatus?: Status;
  currentSearch?: string;
}

export default function IncidentFilters({
  currentSeverity,
  currentStatus,
  currentSearch,
}: Props) {
  const router = useRouter();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset pagination on filter change
      router.push(`/incidents?${params.toString()}`);
    },
    [router]
  );

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <input
        type="text"
        placeholder="Search incidents…"
        defaultValue={currentSearch}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            update("search", (e.target as HTMLInputElement).value);
        }}
        onBlur={(e) => update("search", e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <select
        value={currentSeverity ?? ""}
        onChange={(e) => update("severity", e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All severities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={currentStatus ?? ""}
        onChange={(e) => update("status", e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      {(currentSeverity || currentStatus || currentSearch) && (
        <button
          onClick={() => router.push("/incidents")}
          className="text-sm text-gray-500 hover:text-red-500 px-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
