import Link from "next/link";
import { listIncidents } from "@/lib/api";
// import { SeverityBadge, StatusBadge } from "@/components/badges";
import IncidentFilters from "./IncidentFilters";
import type { Severity, Status } from "@/lib/types";

interface SearchParams {
  severity?: Severity;
  status?: Status;
  search?: string;
  page?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);

  let data;
  let error = "";
  try {
    data = await listIncidents({
      severity: sp.severity,
      status: sp.status,
      search: sp.search,
      page,
      page_size: 10,
    });
    console.log(data)
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load incidents";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
          {data && (
            <p className="text-sm text-gray-500 mt-0.5">{data.total} total</p>
          )}
        </div>
        <Link
          href="/incidents/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + New Incident
        </Link>
      </div>

      {/* Filters (client component) */}
      <IncidentFilters
        currentSeverity={sp.severity}
        currentStatus={sp.status}
        currentSearch={sp.search}
      />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
          {error} — is the backend running on{" "}
          {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}?
        </div>
      )}

      {/* Table */}
      {data && data.results.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No incidents found. Try adjusting filters or{" "}
          <Link href="/incidents/new" className="text-indigo-600 hover:underline">
            create one
          </Link>
          .
        </div>
      )}

      {data && data.results.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">Severity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-32">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-36">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-36">Reporter</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-36">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.results.map((inc) => (
                <tr
                  key={inc.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {inc.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {inc.severity}
                  </td>
                  <td className="px-4 py-3">
                    {inc.status}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {inc.category?.replace("_", " ") ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {inc.reporter_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(inc.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {data && data.count > data.page_size && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-gray-500">
            Page {data.page} of {Math.ceil(data.count / data.page_size)}
          </span>
          <div className="flex gap-2">
            {data.page > 1 && (
              <Link
                href={`/incidents?page=${data.page - 1}`}
                className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            {data.page < Math.ceil(data.count / data.page_size) && (
              <Link
                href={`/incidents?page=${data.page + 1}`}
                className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
