export const categories = [
  {
    id: "inundacion",
    label: "Inundación",
    color: "#158b99",
    icon: "water",
    temporary: true,
  },
  {
    id: "bache",
    label: "Bache o calle dañada",
    color: "#d77551",
    icon: "road",
    temporary: false,
  },
  {
    id: "semaforo",
    label: "Semáforo defectuoso",
    color: "#bc820a",
    icon: "signal",
    temporary: false,
  },
  {
    id: "arbol",
    label: "Árbol caído",
    color: "#4d8e67",
    icon: "tree",
    temporary: true,
  },
  {
    id: "bloqueo",
    label: "Calle bloqueada",
    color: "#c45979",
    icon: "block",
    temporary: true,
  },
  {
    id: "alumbrado",
    label: "Alumbrado público",
    color: "#8873bb",
    icon: "light",
    temporary: false,
  },
  {
    id: "infraestructura",
    label: "Infraestructura dañada",
    color: "#477eae",
    icon: "building",
    temporary: false,
  },
  {
    id: "otro",
    label: "Otro problema urbano",
    color: "#6b7780",
    icon: "pin",
    temporary: false,
  },
] as const;
export const communes = ["Santiago", "Providencia", "Ñuñoa"] as const;
export const moderationStates = [
  "pending",
  "approved",
  "rejected",
  "hidden",
] as const;
export const incidentStates = [
  "reported",
  "community_confirmed",
  "tracking",
  "resolved",
  "outdated",
] as const;
export const stateLabels: Record<string, string> = {
  reported: "Reportado",
  community_confirmed: "Confirmado por vecinos",
  tracking: "En seguimiento",
  resolved: "Resuelto con evidencia",
  outdated: "Desactualizado",
  pending: "Pendiente",
  approved: "Publicado",
  rejected: "Rechazado",
  hidden: "Oculto",
};
export type Category = (typeof categories)[number]["id"];
export type Moderation = (typeof moderationStates)[number];
export type IncidentState = (typeof incidentStates)[number];
export interface ReportInput {
  title: string;
  description: string;
  category: Category;
  commune: (typeof communes)[number];
  latitude: number;
  longitude: number;
  consent: boolean;
}
export interface Report extends Omit<ReportInput, "consent"> {
  id: string;
  reference: string;
  moderation: Moderation;
  status: IncidentState;
  created_at: string;
  updated_at: string;
  last_observed_at: string;
  confirmations: number;
  verified_at: string | null;
  photos?: { id: string; url: string }[];
  events?: {
    id: string;
    created_at: string;
    from_status: string | null;
    to_status: string;
    reason: string;
    evidence_url: string | null;
  }[];
}
export function validateReport(input: unknown): ReportInput {
  if (!input || typeof input !== "object")
    throw new Error("Revisa los datos del reporte.");
  const r = input as Record<string, unknown>;
  const title =
    typeof r.title === "string"
      ? r.title.trim()
      : generateTitle(r.category, r.commune, r.description);
  const description =
    typeof r.description === "string" ? r.description.trim() : "";
  if (title.length < 8 || title.length > 100)
    throw new Error("El título debe tener entre 8 y 100 caracteres.");
  if (description.length < 15 || description.length > 1500)
    throw new Error("La descripción debe tener entre 15 y 1500 caracteres.");
  if (!categories.some((c) => c.id === r.category))
    throw new Error("Elige una categoría válida.");
  if (!communes.some((c) => c === r.commune))
    throw new Error("Elige una comuna del piloto.");
  if (
    typeof r.latitude !== "number" ||
    typeof r.longitude !== "number" ||
    !Number.isFinite(r.latitude) ||
    !Number.isFinite(r.longitude) ||
    r.latitude < -33.6 ||
    r.latitude > -33.3 ||
    r.longitude < -70.85 ||
    r.longitude > -70.45
  )
    throw new Error("Selecciona una ubicación dentro del área de Santiago.");
  if (r.consent !== true)
    throw new Error(
      "Debes confirmar que no incluyes datos personales sensibles.",
    );
  return {
    title,
    description,
    category: r.category as Category,
    commune: r.commune as ReportInput["commune"],
    latitude: r.latitude,
    longitude: r.longitude,
    consent: true,
  };
}
export function isStale(
  r: Pick<Report, "category" | "last_observed_at" | "status">,
  now = Date.now(),
) {
  return (
    r.status !== "resolved" &&
    categories.find((c) => c.id === r.category)?.temporary &&
    now - new Date(r.last_observed_at).getTime() > 24 * 3600 * 1000
  );
}
export function safeEvidence(value: unknown): string | null {
  if (!value) return null;
  try {
    const u = new URL(String(value));
    if (u.protocol === "https:" && !u.username && !u.password) return u.href;
  } catch {
    /* invalid */
  }
  throw new Error("La evidencia debe ser un enlace HTTPS válido.");
}

export function generateTitle(
  category: unknown,
  commune: unknown,
  description: unknown,
): string {
  const label =
    categories.find((c) => c.id === category)?.label ?? "Problema urbano";
  const place = communes.some((c) => c === commune)
    ? String(commune)
    : "Santiago";
  const detail =
    typeof description === "string"
      ? description.trim().replace(/\s+/g, " ")
      : "";
  return `${label} en ${place}: ${detail}`.slice(0, 100).trim();
}
