import { Severity, Status, Category } from "./types";
export interface IncidentListItem {
    id: number;
    title: string;
    severity: Severity;
    status: Status;
    category: Category | null;
    reporter_name: string | null;
    created_at: string;
    updated_at: string;
}

export interface IncidentDetail extends IncidentListItem {
    description: string;
}

export interface CreateIncidentPayload {
    title: string;
    description: string;
    severity: Severity;
    category?: Category;
    reporter_name?: string;
}