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
