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

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
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
