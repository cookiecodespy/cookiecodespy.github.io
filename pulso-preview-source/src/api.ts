import { createClient } from "@supabase/supabase-js";
import type { Report, ReportInput } from "../supabase/functions/_shared/domain";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(url && key);
export const client = configured ? createClient(url, key) : null;
export const canSubmit =
  configured && Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!configured)
    throw new Error("La conexión del proyecto todavía no está configurada.");
  const session = await client!.auth.getSession();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  if (session.data.session)
    headers.set("Authorization", `Bearer ${session.data.session.access_token}`);
  const response = await fetch(`${url}/functions/v1/civic-api${path}`, {
    ...init,
    headers,
    signal: AbortSignal.timeout(25000),
  });
  const data = await response.json().catch(() => {
    throw new Error(
      "El servicio está temporalmente ocupado. Conservamos tu reporte; vuelve a intentar.",
    );
  });
  if (!response.ok)
    throw new Error(data.error || "No pudimos completar la operación.");
  return data;
}
export const listReports = (admin = false) =>
  request<{ reports: Report[] }>(admin ? "/admin/reports" : "/reports");
export const getReport = (id: string, admin = false) =>
  request<{
    report: Report;
    flags?: { id: string; reason: string; kind: string; created_at: string }[];
  }>(`${admin ? "/admin" : ""}/report?id=${encodeURIComponent(id)}`);
export async function submitReport(
  report: ReportInput,
  files: File[],
  token: string,
  requestId?: string,
) {
  const body = new FormData();
  body.set("report", JSON.stringify(report));
  body.set("token", token);
  if (requestId) body.set("request_id", requestId);
  files.forEach((f) => body.append("photos", f));
  return request<{ reference: string }>("/submit", { method: "POST", body });
}
export const mutate = (path: string, data: unknown) =>
  request<Record<string, unknown>>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
export { preparePhoto } from "./photo";
export const requiresTurnstile = true;

export const newsEnabled = false;
export async function newsRequest<T>(path: string, data?: unknown): Promise<T> {
  void path;
  void data;
  throw new Error(
    "Pulso Ahora funciona en el piloto privado. Supabase aún no tiene esta integración.",
  );
}
