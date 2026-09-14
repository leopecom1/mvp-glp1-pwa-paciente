import type { ReactNode } from "react";
import { COPY } from "@/lib/copy";
import { formatDate, formatDateTime, isWithinDays } from "@/lib/dates";
import type { DoseLog, SymptomLog, WeightLog } from "@/lib/types";
import { EmptyState } from "./EmptyState";
import { Card } from "./ui";

const HISTORY_DAYS = 14;

function recent<T extends { loggedAt: string }>(rows: T[]): T[] {
  return rows.filter((row) => isWithinDays(row.loggedAt, HISTORY_DAYS)).slice(0, 8);
}

export function DoseHistory({ rows }: { rows: DoseLog[] }) {
  const items = recent(rows);
  if (items.length === 0) {
    return (
      <EmptyState title={COPY.historyEmptyTitle}>{COPY.historyEmpty}</EmptyState>
    );
  }
  return (
    <HistoryCard>
      <ul className="space-y-3">
        {items.map((row) => (
          <li key={row.id} className="flex flex-col gap-1">
            <span className="text-base font-medium text-ink">
              {row.aplicada ? COPY.doseApplied : COPY.doseMissed}
              {row.dosisMg != null ? ` · ${row.dosisMg} mg` : ""}
            </span>
            <span className="text-base text-muted">{formatDateTime(row.loggedAt)}</span>
          </li>
        ))}
      </ul>
    </HistoryCard>
  );
}

export function SymptomHistory({ rows }: { rows: SymptomLog[] }) {
  const items = recent(rows);
  if (items.length === 0) {
    return (
      <EmptyState title={COPY.historyEmptyTitle}>{COPY.historyEmpty}</EmptyState>
    );
  }
  return (
    <HistoryCard>
      <ul className="space-y-3">
        {items.map((row) => (
          <li key={row.id} className="flex flex-col gap-1">
            <span className="text-base font-medium text-ink">
              N {row.nauseas} · V {row.vomito} · D {row.diarrea} · E {row.estrenimiento} ·
              DA {row.dolorAbdominal}
            </span>
            <span className="text-base text-muted">{formatDateTime(row.loggedAt)}</span>
          </li>
        ))}
      </ul>
    </HistoryCard>
  );
}

export function WeightHistory({ rows }: { rows: WeightLog[] }) {
  const items = recent(rows);
  if (items.length === 0) {
    return (
      <EmptyState title={COPY.historyEmptyTitle}>{COPY.historyEmpty}</EmptyState>
    );
  }
  return (
    <HistoryCard>
      <ul className="space-y-3">
        {items.map((row) => (
          <li key={row.id} className="flex flex-col gap-1">
            <span className="text-base font-medium text-ink tabular-nums">{row.pesoKg} kg</span>
            <span className="text-base text-muted">{formatDate(row.loggedAt)}</span>
          </li>
        ))}
      </ul>
    </HistoryCard>
  );
}

function HistoryCard({ children }: { children: ReactNode }) {
  return (
    <Card className="px-5 py-5">
      <h2 className="font-display text-xl text-ink">{COPY.historyTitle}</h2>
      <div className="mt-4">{children}</div>
    </Card>
  );
}
