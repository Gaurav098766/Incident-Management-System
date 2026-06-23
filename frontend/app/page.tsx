import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Incident Management System
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Track, manage, and resolve incidents efficiently.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/incidents"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            View Incidents
          </Link>

          <Link
            href="/incidents/new"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-black font-medium"
          >
            Create Incident
          </Link>
        </div>
      </div>
    </main>
  );
}