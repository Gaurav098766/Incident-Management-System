import { Severity, Status } from "./types";
import { IncidentDetail, CreateIncidentPayload } from "./interfaces";
import { apiFetch } from "./helpers";


// ── API calls ─────────────────────────────────────────────────────────────────

export async function listIncidents(params: {
    severity?: Severity;
    status?: Status;
    search?: string;
    page?: number;
    page_size?: number;
}): Promise<null> {
    const qs = new URLSearchParams();
    if (params.severity) qs.set("severity", params.severity);
    if (params.status) qs.set("status", params.status);
    if (params.search) qs.set("search", params.search);
    if (params.page) qs.set("page", String(params.page));
    if (params.page_size) qs.set("page_size", String(params.page_size));
    return apiFetch<null>(`/api/incidents/?${qs}`);
}

export async function getIncident(id: number): Promise<IncidentDetail> {
    return apiFetch<IncidentDetail>(`/api/incidents/${id}/`);
}

export async function createIncident(
    payload: CreateIncidentPayload
): Promise<IncidentDetail> {
    return apiFetch<IncidentDetail>("/api/incidents/", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateStatus(
    id: number,
    status: Status
): Promise<IncidentDetail> {
    return apiFetch<IncidentDetail>(`/api/incidents/${id}/status/`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}