import { useSyncExternalStore } from "react";
import { getDefaultClinicName } from "./env";
import type { OnboardingState } from "./types";

const STORAGE_KEY = "kodevant.paciente.onboarding.v1";
const CHANGE_EVENT = "kodevant-onboarding-change";

export function emptyOnboarding(clinicName = getDefaultClinicName()): OnboardingState {
  return {
    inviteToken: null,
    clinicName,
    consentVersionId: null,
    accepted: false,
    membershipId: null,
    orgId: null,
    role: null,
    careTeamAssigned: false,
    firstName: "",
    lastName: "",
    phone: "",
    locale: "es",
    profileComplete: false,
  };
}

export function loadOnboarding(): OnboardingState {
  if (typeof window === "undefined") {
    return emptyOnboarding();
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyOnboarding();
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;
    return { ...emptyOnboarding(), ...parsed, locale: "es" };
  } catch {
    return emptyOnboarding();
  }
}

export function saveOnboarding(next: OnboardingState): OnboardingState {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
  return next;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getOnboardingSnapshot(): string {
  return window.sessionStorage.getItem(STORAGE_KEY) ?? "";
}

export function useOnboarding(): OnboardingState {
  const raw = useSyncExternalStore(subscribe, getOnboardingSnapshot, () => "");
  if (!raw) return emptyOnboarding();
  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;
    return { ...emptyOnboarding(), ...parsed, locale: "es" };
  } catch {
    return emptyOnboarding();
  }
}

/** False during SSR/hydration so route gates do not bounce before sessionStorage is read. */
export function useClientReady(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function acceptPath(state: OnboardingState = loadOnboarding()): string {
  if (!state.inviteToken) return "/aceptar";
  const params = new URLSearchParams({ token: state.inviteToken });
  if (state.clinicName) params.set("clinica", state.clinicName);
  return `/aceptar?${params.toString()}`;
}

export function patchOnboarding(patch: Partial<OnboardingState>): OnboardingState {
  return saveOnboarding({ ...loadOnboarding(), ...patch });
}

export function displayName(state: OnboardingState): string | undefined {
  const name = [state.firstName, state.lastName].filter(Boolean).join(" ").trim();
  return name || undefined;
}
