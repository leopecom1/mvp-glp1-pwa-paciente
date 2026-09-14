import { COPY } from "./copy";
import type {
  AdverseEvent,
  AlertRuleId,
  CreateAdverseEventRequest,
  PatientSafeAlert,
} from "./types";
import { toApiAdverseEventTipo, toPatientSafeAlert } from "./alerts";

const STORAGE_KEY = "kodevant.paciente.alerts.v1";
const CHANGE_EVENT = "kodevant-alerts-change";

/** Demo/API fallback. P0/P1 use Iris pass-copy; P2 keeps the SIN-CHECKIN nudge. */
export const PATIENT_ALERT_COPY: Record<AlertRuleId, string> = {
  "A-OMISION-1": COPY.alertP1Body,
  "A-OMISION-2": COPY.alertP1Body,
  "A-GI-SEVERO": COPY.alertP1Body,
  "A-EA-GRAVE": COPY.alertP0Body,
  "A-PESO-RAPIDO": COPY.alertP1Body,
  "A-SIN-CHECKIN":
    "Hace varios días sin registros en la app. Contactá a tu clínica si necesitás ayuda. Esta aplicación no es un servicio de emergencias.",
};

type DemoStore = {
  seeded: boolean;
  alerts: PatientSafeAlert[];
  adverseEvents: AdverseEvent[];
};

function emptyStore(): DemoStore {
  return { seeded: false, alerts: [], adverseEvents: [] };
}

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function subscribeAlerts(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function loadStore(): DemoStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<DemoStore>;
    return {
      seeded: Boolean(parsed.seeded),
      alerts: Array.isArray(parsed.alerts) ? parsed.alerts.map((row) => toPatientSafeAlert(row)) : [],
      adverseEvents: Array.isArray(parsed.adverseEvents) ? parsed.adverseEvents : [],
    };
  } catch {
    return emptyStore();
  }
}

function saveStore(next: DemoStore, silent = false): DemoStore {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (!silent) notify();
  }
  return next;
}

function isoNow(value?: string): string {
  if (value) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return new Date().toISOString();
}

function demoAlert(
  id: string,
  ruleId: AlertRuleId,
  severity: PatientSafeAlert["severity"],
  hoursAgo: number,
): PatientSafeAlert {
  const createdAt = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
  return toPatientSafeAlert({
    id,
    ruleId,
    severity,
    status: "open",
    message: PATIENT_ALERT_COPY[ruleId],
    createdAt,
    ackedAt: null,
    resolvedAt: null,
  });
}

function ensureSeeded(): DemoStore {
  const store = loadStore();
  if (store.seeded) return store;
  return saveStore(
    {
      seeded: true,
      adverseEvents: store.adverseEvents,
      alerts: [
        demoAlert("demo-alert-p0", "A-EA-GRAVE", "P0", 2),
        demoAlert("demo-alert-p1", "A-GI-SEVERO", "P1", 8),
        demoAlert("demo-alert-p2", "A-SIN-CHECKIN", "P2", 26),
      ],
    },
    true,
  );
}

/** Demo-only: `/inicio?vacio=1` so Iris+Sigma can review the no-alerts empty. */
export function demoForceEmptyAlerts() {
  const store = loadStore();
  saveStore(
    {
      seeded: true,
      alerts: [],
      adverseEvents: store.adverseEvents,
    },
    true,
  );
}

export function demoListOpenAlerts(): PatientSafeAlert[] {
  return ensureSeeded().alerts.filter((row) => row.status === "open");
}

export function demoListAdverseEvents(): AdverseEvent[] {
  return ensureSeeded().adverseEvents;
}

export function demoCreateAdverseEvent(payload: CreateAdverseEventRequest): AdverseEvent {
  const store = ensureSeeded();
  const createdAt = new Date().toISOString();
  const tipo = toApiAdverseEventTipo(payload.tipo);
  const row: AdverseEvent = {
    id: crypto.randomUUID(),
    tipo,
    severidad: payload.severidad,
    inicioAt: isoNow(payload.inicioAt),
    accion: payload.accion,
    createdAt,
  };

  const nextAlerts = upsertDemoEaAlert(store.alerts, createdAt);
  saveStore({
    seeded: true,
    alerts: nextAlerts,
    adverseEvents: [row, ...store.adverseEvents],
  });
  return row;
}

function upsertDemoEaAlert(alerts: PatientSafeAlert[], createdAt: string): PatientSafeAlert[] {
  const existing = alerts.find(
    (row) => row.ruleId === "A-EA-GRAVE" && (row.status === "open" || row.status === "acked"),
  );
  if (existing) {
    return alerts.map((row) =>
      row.id === existing.id
        ? toPatientSafeAlert({
            ...row,
            severity: "P0",
            status: "open",
            message: PATIENT_ALERT_COPY["A-EA-GRAVE"],
          })
        : row,
    );
  }
  return [
    toPatientSafeAlert({
      id: crypto.randomUUID(),
      ruleId: "A-EA-GRAVE",
      severity: "P0",
      status: "open",
      message: PATIENT_ALERT_COPY["A-EA-GRAVE"],
      createdAt,
      ackedAt: null,
      resolvedAt: null,
    }),
    ...alerts,
  ];
}

export function patientAlertFallbackMessage(ruleId?: string): string {
  if (ruleId && ruleId in PATIENT_ALERT_COPY) {
    return PATIENT_ALERT_COPY[ruleId as AlertRuleId];
  }
  return COPY.alertFallback;
}
