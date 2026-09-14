import {
  asItems,
  toAdverseEvent,
  toPatientSafeAlert,
} from "./alerts";
import {
  demoCreateAdverseEvent,
  demoListAdverseEvents,
  demoListOpenAlerts,
} from "./alerts-demo";
import {
  demoCheckinSummary,
  demoCreateDoseLog,
  demoCreateSymptomLog,
  demoCreateWeightLog,
  demoListDoseLogs,
  demoListSymptomLogs,
  demoListWeightLogs,
  demoMedicationPlan,
} from "./checkin-demo";
import { TRATAMIENTO_DATOS_SEED } from "./consent-seed";
import { getApiBaseUrl, isApiConfigured } from "./env";
import type {
  AcceptErrorKind,
  AcceptInviteRequest,
  AcceptInviteResponse,
  AdverseEvent,
  CheckinSummary,
  ConsentVersion,
  CreateAdverseEventRequest,
  CreateDoseLogRequest,
  CreateSymptomLogRequest,
  CreateWeightLogRequest,
  DoseLog,
  MedicationPlan,
  Organization,
  PatientProfile,
  PatientProfilePatch,
  PatientSafeAlert,
  SymptomLog,
  WeightLog,
} from "./types";
import {
  CONSENT_TYPE_TRATAMIENTO,
  PATIENT_PROFILE_IDENTITY_FIELDS,
} from "./types";

export class ApiError extends Error {
  status: number;
  kind: AcceptErrorKind;
  details?: unknown;

  constructor(status: number, message: string, kind: AcceptErrorKind, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.kind = kind;
    this.details = details;
  }
}

function classifyAcceptError(status: number, body: unknown): AcceptErrorKind {
  const text = JSON.stringify(body ?? {}).toLowerCase();

  if (status === 401) return "auth";
  if (text.includes("email") && (text.includes("match") || text.includes("session"))) {
    return "session_mismatch";
  }
  if (text.includes("tratamiento_datos") || text.includes("consent")) {
    return "missing_consent";
  }
  if (
    status === 404 ||
    status === 409 ||
    text.includes("expired") ||
    text.includes("invite not found") ||
    text.includes("already accepted")
  ) {
    return "invalid_or_expired";
  }
  if (status === 403) {
    return "invalid_or_expired";
  }
  return "unknown";
}

async function parseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

async function apiFetch<T>(
  path: string,
  accessToken: string | null,
  init: RequestInit = {},
): Promise<T> {
  if (!isApiConfigured()) {
    throw new ApiError(503, "API no configurada", "unknown");
  }

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  const body = await parseBody(response);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      typeof body === "object" && body && "message" in body
        ? String((body as { message: unknown }).message)
        : `HTTP ${response.status}`,
      classifyAcceptError(response.status, body),
      body,
    );
  }

  return body as T;
}

export function buildAcceptInviteRequest(token: string): AcceptInviteRequest {
  return {
    token,
    consents: [{ consentType: CONSENT_TYPE_TRATAMIENTO }],
  };
}

export async function acceptInvite(
  accessToken: string | null,
  payload: AcceptInviteRequest,
): Promise<AcceptInviteResponse> {
  return apiFetch<AcceptInviteResponse>("/v1/invites/accept", accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type OnboardingStatus = {
  orgId: string;
  hasSede: boolean;
  hasMedico: boolean;
  hasPatientInviteOrAccepted: boolean;
  consentsSeedOk: boolean;
};

export async function getOnboardingStatus(
  accessToken: string | null,
  orgId: string,
): Promise<OnboardingStatus | null> {
  try {
    return await apiFetch<OnboardingStatus>(
      `/v1/orgs/${orgId}/onboarding-status`,
      accessToken,
    );
  } catch {
    return null;
  }
}

export async function getOrganization(
  accessToken: string | null,
  orgId: string,
): Promise<Organization | null> {
  try {
    return await apiFetch<Organization>(`/v1/orgs/${orgId}`, accessToken);
  } catch {
    return null;
  }
}

export async function getTratamientoDatosVersion(
  accessToken: string | null,
): Promise<ConsentVersion> {
  try {
    const rows = await apiFetch<ConsentVersion[]>(
      `/v1/consent-versions?locale=es&current=1&consentType=${CONSENT_TYPE_TRATAMIENTO}`,
      accessToken,
    );
    const current = rows.find((row) => row.consentType === CONSENT_TYPE_TRATAMIENTO);
    if (current) return current;
  } catch {
    // Fall back to Iris seed if the session cannot read versions yet.
  }

  return {
    id: "",
    consentType: TRATAMIENTO_DATOS_SEED.consentType,
    version: TRATAMIENTO_DATOS_SEED.version,
    title: TRATAMIENTO_DATOS_SEED.title,
    bodyMd: TRATAMIENTO_DATOS_SEED.body,
    locale: TRATAMIENTO_DATOS_SEED.locale,
    isCurrent: true,
  };
}

export async function getPatientProfile(
  accessToken: string | null,
): Promise<PatientProfile | null> {
  try {
    return await apiFetch<PatientProfile>("/v1/me/patient-profile", accessToken);
  } catch {
    return null;
  }
}

/** Ficha mínima PATCH: demography only. Identity keys are never sent. */
export function buildPatientProfilePatch(input: {
  fullName: string;
  phoneE164?: string;
}): PatientProfilePatch {
  const patch: PatientProfilePatch = {
    fullName: input.fullName.trim(),
  };
  if (input.phoneE164) {
    patch.phoneE164 = input.phoneE164;
  }

  const sanitized = { ...patch } as PatientProfilePatch & Record<string, unknown>;
  for (const field of PATIENT_PROFILE_IDENTITY_FIELDS) {
    delete sanitized[field];
  }
  return {
    ...(sanitized.fullName ? { fullName: sanitized.fullName } : {}),
    ...(typeof sanitized.phoneE164 === "string" ? { phoneE164: sanitized.phoneE164 } : {}),
  };
}

export async function patchPatientProfile(
  accessToken: string | null,
  patch: PatientProfilePatch,
): Promise<PatientProfile | null> {
  const body = buildPatientProfilePatch({
    fullName: patch.fullName ?? "",
    phoneE164: patch.phoneE164,
  });
  if (!body.fullName) return null;

  try {
    return await apiFetch<PatientProfile>("/v1/me/patient-profile", accessToken, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  } catch {
    return null;
  }
}

export async function hydrateCareContext(
  accessToken: string | null,
  orgId?: string | null,
): Promise<{
  profile: PatientProfile | null;
  organization: Organization | null;
}> {
  const [profile, organization] = await Promise.all([
    getPatientProfile(accessToken),
    orgId ? getOrganization(accessToken, orgId) : Promise.resolve(null),
  ]);
  return { profile, organization };
}

export function localAcceptFallback(): AcceptInviteResponse {
  return {
    membershipId: "local-membership",
    orgId: "local-org",
    role: "paciente",
    replayed: false,
  };
}

export function isUsableInviteToken(token: string | null | undefined): boolean {
  return Boolean(token && token.trim().length >= 16);
}

export function profileHasAssignedCareTeam(profile: PatientProfile | null): boolean {
  return Boolean(profile?.sedeId || profile?.medicoResponsableMembershipId);
}

function asIso(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

function asNumber(value: unknown): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeDoseLog(row: DoseLog): DoseLog {
  return {
    ...row,
    dosisMg: asNumber(row.dosisMg),
    loggedAt: asIso(row.loggedAt),
    createdAt: row.createdAt ? asIso(row.createdAt) : undefined,
  };
}

function normalizeWeightLog(row: WeightLog): WeightLog {
  return {
    ...row,
    pesoKg: asNumber(row.pesoKg) ?? row.pesoKg,
    loggedAt: asIso(row.loggedAt),
    createdAt: row.createdAt ? asIso(row.createdAt) : undefined,
  };
}

function normalizeSymptomLog(row: SymptomLog): SymptomLog {
  return {
    ...row,
    loggedAt: asIso(row.loggedAt),
    createdAt: row.createdAt ? asIso(row.createdAt) : undefined,
  };
}

export async function getMedicationPlan(
  accessToken: string | null,
): Promise<MedicationPlan | null> {
  if (!isApiConfigured()) return demoMedicationPlan();
  try {
    return await apiFetch<MedicationPlan>("/v1/me/medication-plan", accessToken);
  } catch {
    return null;
  }
}

export async function createDoseLog(
  accessToken: string | null,
  payload: CreateDoseLogRequest,
): Promise<DoseLog> {
  if (!isApiConfigured()) return demoCreateDoseLog(payload);
  const row = await apiFetch<DoseLog>("/v1/me/dose-logs", accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeDoseLog(row);
}

export async function listDoseLogs(accessToken: string | null): Promise<DoseLog[]> {
  if (!isApiConfigured()) return demoListDoseLogs();
  try {
    const rows = await apiFetch<DoseLog[]>("/v1/me/dose-logs", accessToken);
    return rows.map(normalizeDoseLog);
  } catch {
    return [];
  }
}

export async function createSymptomLog(
  accessToken: string | null,
  payload: CreateSymptomLogRequest,
): Promise<SymptomLog> {
  if (!isApiConfigured()) return demoCreateSymptomLog(payload);
  const row = await apiFetch<SymptomLog>("/v1/me/symptom-logs", accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeSymptomLog(row);
}

export async function listSymptomLogs(accessToken: string | null): Promise<SymptomLog[]> {
  if (!isApiConfigured()) return demoListSymptomLogs();
  try {
    const rows = await apiFetch<SymptomLog[]>("/v1/me/symptom-logs", accessToken);
    return rows.map(normalizeSymptomLog);
  } catch {
    return [];
  }
}

export async function createWeightLog(
  accessToken: string | null,
  payload: CreateWeightLogRequest,
): Promise<WeightLog> {
  if (!isApiConfigured()) return demoCreateWeightLog(payload);
  const row = await apiFetch<WeightLog>("/v1/me/weight-logs", accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeWeightLog(row);
}

export async function listWeightLogs(accessToken: string | null): Promise<WeightLog[]> {
  if (!isApiConfigured()) return demoListWeightLogs();
  try {
    const rows = await apiFetch<WeightLog[]>("/v1/me/weight-logs", accessToken);
    return rows.map(normalizeWeightLog);
  } catch {
    return [];
  }
}

export async function getCheckinSummary(
  accessToken: string | null,
): Promise<CheckinSummary | null> {
  if (!isApiConfigured()) return demoCheckinSummary();
  try {
    const summary = await apiFetch<CheckinSummary>("/v1/me/checkin-summary", accessToken);
    return {
      lastDose: summary.lastDose ? normalizeDoseLog(summary.lastDose) : null,
      lastWeight: summary.lastWeight ? normalizeWeightLog(summary.lastWeight) : null,
      adherence7d: summary.adherence7d,
    };
  } catch {
    return null;
  }
}

/** GET /v1/me/alerts?status=open — patient-safe; resolve notes are stripped. */
export async function listOpenAlerts(
  accessToken: string | null,
): Promise<PatientSafeAlert[]> {
  if (!isApiConfigured()) return demoListOpenAlerts();
  try {
    const body = await apiFetch<unknown>("/v1/me/alerts?status=open", accessToken);
    return asItems<unknown>(body).map(toPatientSafeAlert).filter((row) => row.id);
  } catch {
    return [];
  }
}

export async function listAdverseEvents(
  accessToken: string | null,
): Promise<AdverseEvent[]> {
  if (!isApiConfigured()) return demoListAdverseEvents();
  try {
    const body = await apiFetch<unknown>("/v1/me/adverse-events", accessToken);
    return asItems<unknown>(body).map(toAdverseEvent).filter((row) => row.id);
  } catch {
    return [];
  }
}

export async function createAdverseEvent(
  accessToken: string | null,
  payload: CreateAdverseEventRequest,
): Promise<AdverseEvent> {
  if (!isApiConfigured()) return demoCreateAdverseEvent(payload);
  const row = await apiFetch<unknown>("/v1/me/adverse-events", accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return toAdverseEvent(row);
}
