import { COPY } from "./copy";
import type {
  AdverseEvent,
  AlertSeverity,
  AlertStatus,
  CreateAdverseEventRequest,
  PatientAdverseEventTipo,
  PatientSafeAlert,
} from "./types";
import { ALERT_SEVERITY_VALUES, ALERT_STATUS_VALUES } from "./types";

const PATIENT_SAFE_KEYS = [
  "id",
  "ruleId",
  "severity",
  "status",
  "message",
  "createdAt",
  "ackedAt",
  "resolvedAt",
] as const;

const SEVERITY_RANK: Record<AlertSeverity, number> = { P0: 0, P1: 1, P2: 2 };

/**
 * Soft-map UI copy “dolor abdominal intenso” → API `gi_intolerable`.
 * Never POST `dolor_abdominal_intenso` (that enum does not exist).
 */
export function toApiAdverseEventTipo(value: string): PatientAdverseEventTipo {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  if (
    normalized === "dolor_abdominal_intenso" ||
    normalized === "gi_intolerable" ||
    normalized.includes("dolor_abdominal")
  ) {
    return "gi_intolerable";
  }
  return "otro_grave";
}

export function buildCreateAdverseEventRequest(input: {
  tipo: string;
  severidad: CreateAdverseEventRequest["severidad"];
  inicioAt: string;
  accion: CreateAdverseEventRequest["accion"];
}): CreateAdverseEventRequest {
  return {
    tipo: toApiAdverseEventTipo(input.tipo),
    severidad: input.severidad,
    inicioAt: input.inicioAt,
    accion: input.accion,
  };
}

function asIso(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

function asIsoOrNull(value: unknown): string | null {
  if (value == null || value === "") return null;
  return asIso(value);
}

function asSeverity(value: unknown): AlertSeverity {
  const raw = String(value ?? "");
  return (ALERT_SEVERITY_VALUES as readonly string[]).includes(raw)
    ? (raw as AlertSeverity)
    : "P1";
}

function asStatus(value: unknown): AlertStatus {
  const raw = String(value ?? "");
  return (ALERT_STATUS_VALUES as readonly string[]).includes(raw)
    ? (raw as AlertStatus)
    : "open";
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

/** Drop resolve notes, evidence, and any extra clinic fields before UI render. */
export function toPatientSafeAlert(value: unknown): PatientSafeAlert {
  const row = asRecord(value);
  const safe: PatientSafeAlert = {
    id: String(row.id ?? ""),
    ruleId: String(row.ruleId ?? ""),
    severity: asSeverity(row.severity),
    status: asStatus(row.status),
    message: String(row.message || COPY.alertFallback),
    createdAt: asIso(row.createdAt),
    ackedAt: asIsoOrNull(row.ackedAt),
    resolvedAt: asIsoOrNull(row.resolvedAt),
  };

  for (const key of Object.keys(safe) as (keyof PatientSafeAlert)[]) {
    if (!(PATIENT_SAFE_KEYS as readonly string[]).includes(key)) {
      delete (safe as Record<string, unknown>)[key];
    }
  }
  return safe;
}

export function asItems<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === "object" && "items" in body) {
    const items = (body as { items: unknown }).items;
    if (Array.isArray(items)) return items as T[];
  }
  return [];
}

export function toAdverseEvent(value: unknown): AdverseEvent {
  const row = asRecord(value);
  return {
    id: String(row.id ?? ""),
    orgId: typeof row.orgId === "string" ? row.orgId : undefined,
    patientProfileId:
      typeof row.patientProfileId === "string" ? row.patientProfileId : undefined,
    tipo: toApiAdverseEventTipo(String(row.tipo ?? "otro_grave")),
    severidad:
      row.severidad === "p0" || row.severidad === "p1" || row.severidad === "p2"
        ? row.severidad
        : "p0",
    inicioAt: asIso(row.inicioAt),
    accion:
      row.accion === "auto_cuidado" ||
      row.accion === "contacto_clinica" ||
      row.accion === "urgencias" ||
      row.accion === "indicacion_medica"
        ? row.accion
        : "contacto_clinica",
    createdAt: row.createdAt ? asIso(row.createdAt) : undefined,
  };
}

/** Home banners: P0 + P1 always; P2 only the SIN-CHECKIN nudge (no full queue). */
export function alertsForPatientBanners(alerts: PatientSafeAlert[]): PatientSafeAlert[] {
  return alerts
    .filter((row) => row.status === "open")
    .filter((row) => {
      if (row.severity === "P0" || row.severity === "P1") return true;
      return row.severity === "P2" && row.ruleId === "A-SIN-CHECKIN";
    })
    .sort((a, b) => {
      const rank = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      if (rank !== 0) return rank;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}
