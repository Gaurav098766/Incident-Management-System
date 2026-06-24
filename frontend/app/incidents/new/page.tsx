"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createIncident } from "@/lib/api";
import type { Severity, Category} from "@/lib/types";

export default function NewIncidentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [category, setCategory] = useState<Category | "">("");
  const [reporter, setReporter] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      setSubmitError("Title and description are required.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const incident = await createIncident({
        title,
        description,
        severity,
        category: category || undefined,
        reporter_name: reporter || undefined,
      });
      router.push(`/incidents/${incident.id}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to create incident");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
          ← Back to incidents
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">New Incident</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary of the incident"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? What is the impact?"
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>

        {/* Severity + Category row */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select category…</option>
              <option value="database">Database</option>
              <option value="network">Network</option>
              <option value="authentication">Authentication</option>
              <option value="third_party_api">Third-party API</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Reporter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reporter Name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
            placeholder="Who is reporting this?"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Error + Submit */}
        {submitError && (
          <p className="text-sm text-red-600">{submitError}</p>
        )}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create Incident"}
        </button>
      </div>
    </div>
  );
}