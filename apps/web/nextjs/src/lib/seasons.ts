import { getApiUrl } from "@/lib/api-url";

export type SeasonStatus = "DRAFT" | "ACTIVE" | "CLOSED";

export type Season = {
  id: string;
  name: string;
  description: string | null;
  code: string;
  status: SeasonStatus;
  calendarYear: number | null;
  startsOn: string | null;
  endsOn: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type SeasonInput = {
  name: string;
  description?: string;
  code: string;
  status: SeasonStatus;
  calendarYear?: number | null;
  startsOn?: string | null;
  endsOn?: string | null;
  version?: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (response.status === 204) {
    return undefined as T;
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body.error === "string" ? body.error : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body as T;
}

export function listSeasons() {
  return request<Season[]>("/api/seasons");
}

export function getSeason(id: string) {
  return request<Season>(`/api/seasons/${id}`);
}

export function createSeason(input: SeasonInput) {
  return request<Season>("/api/seasons", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateSeason(id: string, input: SeasonInput) {
  return request<Season>(`/api/seasons/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function archiveSeason(id: string) {
  return request<void>(`/api/seasons/${id}`, { method: "DELETE" });
}
