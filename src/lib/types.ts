export const CONSENT_TYPE_TRATAMIENTO = "tratamiento_datos" as const;

export type ConsentType = typeof CONSENT_TYPE_TRATAMIENTO;

export type AcceptConsentItem = {
  consentType: ConsentType;
};

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

export type PatientProfile = {
  id?: string;
  userId?: string;
  orgId?: string;
  organizationId?: string;
  membershipId?: string;
  sedeId?: string | null;
  medicoResponsableId?: string | null;
  medicoResponsableMembershipId?: string | null;
  fullName?: string | null;
  dateOfBirth?: string | null;
  sexAtBirth?: string | null;
  phoneE164?: string | null;
};

export type PatientProfilePatch = {
  fullName?: string;
  phoneE164?: string;
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
