export const CONSENT_TYPE_TRATAMIENTO = "tratamiento_datos" as const;

export type ConsentType = typeof CONSENT_TYPE_TRATAMIENTO;

export type AcceptConsentItem = {
  consentType: ConsentType;
};

/** Product body: consentType only. Do not send consentVersionId. */
export type AcceptInviteRequest = {
  token: string;
  consents: AcceptConsentItem[];
};

export type AcceptInviteResponse = {
  membershipId: string;
  orgId: string;
  role: string;
  replayed?: boolean;
};

export type ConsentVersion = {
  id: string;
  consentType: string;
  version: string;
  title: string;
  bodyMd: string;
  locale: string;
  isCurrent: boolean;
};

/** GET /v1/me/patient-profile — matches mvp-glp1-api main. */
export type PatientProfile = {
  id: string;
  userId: string;
  orgId: string;
  membershipId: string;
  sedeId: string | null;
  medicoResponsableMembershipId: string | null;
  fullName: string | null;
  dateOfBirth: string | null;
  sexAtBirth: string | null;
  phoneE164: string | null;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * PATCH /v1/me/patient-profile — demography only.
 * Identity keys are rejected with 403 by the API (and stripped here).
 */
export type PatientProfilePatch = {
  fullName?: string;
  dateOfBirth?: string;
  sexAtBirth?: string;
  phoneE164?: string;
};

/** API identity lock (403) plus the real médico field copied on accept. */
export const PATIENT_PROFILE_IDENTITY_FIELDS = [
  "organizationId",
  "orgId",
  "membershipId",
  "medicoResponsableId",
  "medicoResponsableMembershipId",
  "sedeId",
  "userId",
] as const;

export type PatientProfileIdentityField = (typeof PATIENT_PROFILE_IDENTITY_FIELDS)[number];

export type Organization = {
  id: string;
  name: string;
  locale?: string;
};

export type AcceptErrorKind =
  | "auth"
  | "invalid_or_expired"
  | "missing_consent"
  | "session_mismatch"
  | "unknown";

export type OnboardingState = {
  inviteToken: string | null;
  clinicName: string;
  consentVersionId: string | null;
  accepted: boolean;
  membershipId: string | null;
  orgId: string | null;
  role: string | null;
  /** True after accept: API copied médico/sede from the invite. Never editable. */
  careTeamAssigned: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  locale: "es";
  profileComplete: boolean;
};

export type AuthSession = {
  accessToken: string;
  userId: string;
  email: string;
  stub: boolean;
};

export const MOTIVO_OMISION_VALUES = [
  "olvido",
  "malestar",
  "viaje",
  "falta_medicamento",
  "indicacion_medica",
  "otro",
] as const;

export type MotivoOmision = (typeof MOTIVO_OMISION_VALUES)[number];

export const SITIO_INYECCION_VALUES = ["abdomen", "muslo", "brazo", "otro"] as const;

export type SitioInyeccion = (typeof SITIO_INYECCION_VALUES)[number];

export const GI_SCALE_KEYS = [
  "nauseas",
  "vomito",
  "diarrea",
  "estrenimiento",
  "dolorAbdominal",
] as const;

export type GiScaleKey = (typeof GI_SCALE_KEYS)[number];

/** GET /v1/me/medication-plan — Épica 3, used to prefill dosisMg + plan id. */
export type MedicationPlan = {
  id: string;
  orgId?: string;
  patientProfileId?: string;
  doseLabel?: string | null;
  marca?: string | null;
  status?: string;
  drug?: {
    molecule?: string;
    frequency?: string;
    labelEs?: string;
    route?: string;
  } | null;
};

/** POST /v1/me/dose-logs — API PR #8 (`fb57721`). UI fechaHoraDosis → loggedAt. */
export type CreateDoseLogRequest = {
  medicationPlanId: string;
  aplicada: boolean;
  dosisMg?: number;
  motivoOmision?: MotivoOmision;
  /** Structured site only. Never copy site text into notaPaciente. */
  sitioInyeccion?: SitioInyeccion;
  /** Free-text notes only. Omit when unused. */
  notaPaciente?: string;
  loggedAt?: string;
};

export type DoseLog = {
  id: string;
  orgId?: string;
  patientProfileId?: string;
  medicationPlanId: string;
  aplicada: boolean;
  dosisMg: number | null;
  motivoOmision: MotivoOmision | null;
  sitioInyeccion?: SitioInyeccion | null;
  notaPaciente?: string | null;
  loggedAt: string;
  createdAt?: string;
};

/** POST /v1/me/symptom-logs — GI scales 0–10. No mood / fotos / saciedad. */
export type CreateSymptomLogRequest = {
  nauseas: number;
  vomito: number;
  diarrea: number;
  estrenimiento: number;
  dolorAbdominal: number;
  loggedAt?: string;
};

export type SymptomLog = CreateSymptomLogRequest & {
  id: string;
  orgId?: string;
  patientProfileId?: string;
  loggedAt: string;
  createdAt?: string;
};

/** POST /v1/me/weight-logs — UI fechaMedicion → loggedAt. */
export type CreateWeightLogRequest = {
  pesoKg: number;
  loggedAt?: string;
};

export type WeightLog = {
  id: string;
  orgId?: string;
  patientProfileId?: string;
  pesoKg: number;
  loggedAt: string;
  createdAt?: string;
};

export type AdherenceSummary = {
  medicationPlanId?: string;
  days: number;
  frequency: string;
  aplicadas: number;
  esperadas: number;
  ratio: number | null;
};

/** GET /v1/me/checkin-summary */
export type CheckinSummary = {
  lastDose: DoseLog | null;
  lastWeight: WeightLog | null;
  adherence7d: AdherenceSummary | null;
};

export type CheckInTipo = "dosis" | "sintomas" | "peso";

/** GET /v1/me/alerts — patient-safe payload (API PR #9). No resolve note, no evidence. */
export const ALERT_SEVERITY_VALUES = ["P0", "P1", "P2"] as const;
export type AlertSeverity = (typeof ALERT_SEVERITY_VALUES)[number];

export const ALERT_STATUS_VALUES = ["open", "acked", "resolved"] as const;
export type AlertStatus = (typeof ALERT_STATUS_VALUES)[number];

export const ALERT_RULE_IDS = [
  "A-OMISION-1",
  "A-OMISION-2",
  "A-GI-SEVERO",
  "A-EA-GRAVE",
  "A-PESO-RAPIDO",
  "A-SIN-CHECKIN",
] as const;
export type AlertRuleId = (typeof ALERT_RULE_IDS)[number];

export type PatientSafeAlert = {
  id: string;
  ruleId: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  createdAt: string;
  ackedAt: string | null;
  resolvedAt: string | null;
};

/**
 * POST /v1/me/adverse-events — API PR #9.
 * Patient UI only offers `gi_intolerable` | `otro_grave`.
 * Copy “dolor abdominal intenso” maps to `gi_intolerable` (never send `dolor_abdominal_intenso`).
 */
export const PATIENT_ADVERSE_EVENT_TIPO_VALUES = ["gi_intolerable", "otro_grave"] as const;
export type PatientAdverseEventTipo = (typeof PATIENT_ADVERSE_EVENT_TIPO_VALUES)[number];

export const ADVERSE_EVENT_SEVERIDAD_VALUES = ["p0", "p1", "p2"] as const;
export type AdverseEventSeveridad = (typeof ADVERSE_EVENT_SEVERIDAD_VALUES)[number];

export const ADVERSE_EVENT_ACCION_VALUES = [
  "auto_cuidado",
  "contacto_clinica",
  "urgencias",
  "indicacion_medica",
] as const;
export type AdverseEventAccion = (typeof ADVERSE_EVENT_ACCION_VALUES)[number];

export type CreateAdverseEventRequest = {
  tipo: PatientAdverseEventTipo;
  severidad: AdverseEventSeveridad;
  inicioAt: string;
  accion: AdverseEventAccion;
};

export type AdverseEvent = CreateAdverseEventRequest & {
  id: string;
  orgId?: string;
  patientProfileId?: string;
  createdAt?: string;
};
