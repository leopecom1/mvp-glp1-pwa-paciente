import { parseDosisMgFromDoseLabel } from "./dates";
import type {
  AdherenceSummary,
  CheckinSummary,
  CreateDoseLogRequest,
  CreateSymptomLogRequest,
  CreateWeightLogRequest,
  DoseLog,
  MedicationPlan,
  SymptomLog,
  WeightLog,
} from "./types";

const STORAGE_KEY = "kodevant.paciente.checkins.v1";
const CHANGE_EVENT = "kodevant-checkins-change";

export const DEMO_MEDICATION_PLAN: MedicationPlan = {
  id: "00000000-0000-4000-8000-000000000001",
  doseLabel: "0.25 mg",
  marca: "Demo",
  status: "activo",
  drug: {
    molecule: "semaglutida",
    frequency: "semanal",
    labelEs: "Semaglutida semanal",
  },
};

type DemoStore = {
  doseLogs: DoseLog[];
  symptomLogs: SymptomLog[];
  weightLogs: WeightLog[];
};

function emptyStore(): DemoStore {
  return { doseLogs: [], symptomLogs: [], weightLogs: [] };
}

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function loadDemoCheckins(): DemoStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<DemoStore>;
    return {
      doseLogs: parsed.doseLogs ?? [],
      symptomLogs: parsed.symptomLogs ?? [],
      weightLogs: parsed.weightLogs ?? [],
    };
  } catch {
    return emptyStore();
  }
}

function saveDemoCheckins(next: DemoStore): DemoStore {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify();
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

export function demoMedicationPlan(): MedicationPlan {
  return DEMO_MEDICATION_PLAN;
}

export function demoCreateDoseLog(payload: CreateDoseLogRequest): DoseLog {
  const store = loadDemoCheckins();
  const loggedAt = isoNow(payload.loggedAt);
  const row: DoseLog = {
    id: crypto.randomUUID(),
    medicationPlanId: payload.medicationPlanId || DEMO_MEDICATION_PLAN.id,
    aplicada: payload.aplicada,
    dosisMg:
      payload.dosisMg ?? parseDosisMgFromDoseLabel(DEMO_MEDICATION_PLAN.doseLabel),
    motivoOmision: payload.aplicada ? null : (payload.motivoOmision ?? null),
    sitioInyeccion: payload.sitioInyeccion ?? null,
    notaPaciente: payload.notaPaciente?.trim() || null,
    loggedAt,
    createdAt: loggedAt,
  };
  saveDemoCheckins({ ...store, doseLogs: [row, ...store.doseLogs] });
  return row;
}

export function demoListDoseLogs(): DoseLog[] {
  return loadDemoCheckins().doseLogs;
}

export function demoCreateSymptomLog(payload: CreateSymptomLogRequest): SymptomLog {
  const store = loadDemoCheckins();
  const loggedAt = isoNow(payload.loggedAt);
  const row: SymptomLog = {
    id: crypto.randomUUID(),
    nauseas: payload.nauseas,
    vomito: payload.vomito,
    diarrea: payload.diarrea,
    estrenimiento: payload.estrenimiento,
    dolorAbdominal: payload.dolorAbdominal,
    loggedAt,
    createdAt: loggedAt,
  };
  saveDemoCheckins({ ...store, symptomLogs: [row, ...store.symptomLogs] });
  return row;
}

export function demoListSymptomLogs(): SymptomLog[] {
  return loadDemoCheckins().symptomLogs;
}

export function demoCreateWeightLog(payload: CreateWeightLogRequest): WeightLog {
  const store = loadDemoCheckins();
  const loggedAt = isoNow(payload.loggedAt);
  const row: WeightLog = {
    id: crypto.randomUUID(),
    pesoKg: payload.pesoKg,
    loggedAt,
    createdAt: loggedAt,
  };
  saveDemoCheckins({ ...store, weightLogs: [row, ...store.weightLogs] });
  return row;
}

export function demoListWeightLogs(): WeightLog[] {
  return loadDemoCheckins().weightLogs;
}

function expectedDoses(frequency: string, days: number): number {
  if (days <= 0) return 0;
  if (frequency === "diario") return days;
  return Math.max(1, Math.floor(days / 7));
}

export function demoCheckinSummary(): CheckinSummary {
  const { doseLogs, weightLogs } = loadDemoCheckins();
  const lastDose = doseLogs[0] ?? null;
  const lastWeight = weightLogs[0] ?? null;
  const from = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const frequency = DEMO_MEDICATION_PLAN.drug?.frequency ?? "semanal";
  const aplicadas = doseLogs.filter(
    (row) => row.aplicada && new Date(row.loggedAt).getTime() >= from,
  ).length;
  const esperadas = expectedDoses(frequency, 7);
  const adherence7d: AdherenceSummary = {
    medicationPlanId: DEMO_MEDICATION_PLAN.id,
    days: 7,
    frequency,
    aplicadas,
    esperadas,
    ratio: esperadas === 0 ? null : aplicadas / esperadas,
  };

  return {
    lastDose,
    lastWeight,
    adherence7d: lastDose || aplicadas ? adherence7d : null,
  };
}
