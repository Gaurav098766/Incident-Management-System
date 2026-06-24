"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getIncident, updateStatus } from "@/lib/api";
import type {Status } from "@/lib/types";
import type { IncidentDetail} from "@/lib/interfaces";
import { SeverityBadge, StatusBadge } from "@/components/badges";

const STATUS_OPTIONS: Status[] = ["open", "in_progress", "resolved", "closed"];
const STATUS_LABELS: Record<Status, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    getIncident(Number(id))
      .then(setIncident)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: Status) {
    if (!incident) return;
    setStatusUpdating(true);
    setStatusError("");
    try {
      const updated = await updateStatus(incident.id, newStatus);
      setIncident(updated);
    } catch (e) {
      setStatusError(e instanceof Error ? e.message : "Status update failed");
    } finally {
      setStatusUpdating(false);
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-400">Loading…</div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">{error}</div>
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mt-4 block">← Back</Link>
    </div>
  );

  if (!incident) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/incidents" className="text-sm text-gray-400 hover:text-gray-600">
          ← Back to incidents
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold text-gray-900">{incident.title}</h1>
          <span className="text-xs text-gray-400 whitespace-nowrap mt-1">#{incident.id}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
          {incident.category && (
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
              {incident.category.replace("_", " ")}
            </span>
          )}
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">{incident.description}</p>

        <div className="text-xs text-gray-400 space-y-0.5">
          {incident.reporter_name && <p>Reported by: {incident.reporter_name}</p>}
          <p>Created: {new Date(incident.created_at).toLocaleString()}</p>
          <p>Updated: {new Date(incident.updated_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Status update */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={statusUpdating || s === incident.status}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors disabled:cursor-not-allowed ${
                s === incident.status
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        {statusError && <p className="text-xs text-red-500 mt-2">{statusError}</p>}
        {statusUpdating && <p className="text-xs text-gray-400 mt-2">Updating…</p>}
      </div>
    </div>
  );
}