import type { Severity, Status } from "@/lib/types";

const SEVERITY_STYLES: Record<Severity, string> = {
  low:      "bg-gray-100 text-gray-700",
  medium:   "bg-yellow-100 text-yellow-800",
  high:     "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800 font-semibold",
};

const STATUS_STYLES: Record<Status, string> = {
  open:        "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  resolved:    "bg-green-100 text-green-800",
  closed:      "bg-gray-200 text-gray-600",
};

const STATUS_LABELS: Record<Status, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs uppercase tracking-wide ${SEVERITY_STYLES[severity]}`}>
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}