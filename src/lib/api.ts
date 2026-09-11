import { TRATAMIENTO_DATOS_SEED } from "./consent-seed";
import { getApiBaseUrl, isApiConfigured } from "./env";
import type {
  AcceptErrorKind,
  AcceptInviteRequest,
  AcceptInviteResponse,
  ConsentVersion,
  PatientProfile,
  PatientProfilePatch,
} from "./types";
import { CONSENT_TYPE_TRATAMIENTO } from "./types";

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
  if (text.includes("tratamiento_datos") || text.includes("consent")) {
    return "missing_consent";
  }
  if (text.includes("email") && (text.includes("match") || text.includes("session"))) {
    return "session_mismatch";
  }
  if (
    status === 404 ||
    status === 403 ||
    text.includes("expired") ||
    text.includes("invite not found") ||
    text.includes("already accepted")
  ) {
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

export async function acceptInvite(
  accessToken: string | null,
  payload: AcceptInviteRequest,
): Promise<AcceptInviteResponse> {
  return apiFetch<AcceptInviteResponse>("/v1/invites/accept", accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
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
    // Épica 2 may not be merged yet — fall back to seed copy.
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

export async function patchPatientProfile(
  accessToken: string | null,
  patch: PatientProfilePatch,
): Promise<PatientProfile | null> {
  try {
    return await apiFetch<PatientProfile>("/v1/me/patient-profile", accessToken, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  } catch {
    return null;
  }
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
