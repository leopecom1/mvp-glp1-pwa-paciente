"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCheckinSummary } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { formatDate, formatDateTime } from "@/lib/dates";
import type { CheckinSummary } from "@/lib/types";
import { EmptyState } from "./EmptyState";
import { Card } from "./ui";

export function CheckInSummaryCards() {
  const { session } = useAuth();
  const [summary, setSummary] = useState<CheckinSummary | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCheckinSummary(session?.accessToken ?? null).then((next) => {
      if (cancelled) return;
      setSummary(next);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [session?.accessToken]);

  if (!loaded) return null;

  if (!summary || (!summary.lastDose && !summary.lastWeight && !summary.adherence7d)) {
    return (
      <EmptyState
        title={COPY.homeEmptyTitle}
        actions={
          <Link
            href="/inicio#check-in"
            className="inline-flex min-h-11 items-center text-base font-medium text-accent"
          >
            {COPY.homeEmptyCheckInCta}
          </Link>
        }
      >
        {COPY.homeEmpty}
      </EmptyState>
    );
  }

  const adherence = summary.adherence7d;

  return (
    <div className="flex flex-col gap-3" aria-label={COPY.summaryRegion}>
      <Card className="px-5 py-5">
        <h2 className="font-display text-xl text-ink">{COPY.summaryLastDose}</h2>
        <p className="mt-2 text-base text-muted">
          {summary.lastDose
            ? `${summary.lastDose.aplicada ? COPY.doseApplied : COPY.doseMissed}${
                summary.lastDose.dosisMg != null ? ` · ${summary.lastDose.dosisMg} mg` : ""
              } · ${formatDateTime(summary.lastDose.loggedAt)}`
            : COPY.summaryNoDose}
        </p>
      </Card>
      <Card className="px-5 py-5">
        <h2 className="font-display text-xl text-ink">{COPY.summaryAdherence}</h2>
        <p className="mt-2 text-base text-muted">
          {adherence
            ? COPY.summaryAdherenceValue(adherence.aplicadas, adherence.esperadas)
            : COPY.summaryNoAdherence}
        </p>
      </Card>
      <Card className="px-5 py-5">
        <h2 className="font-display text-xl text-ink">{COPY.summaryLastWeight}</h2>
        <p className="mt-2 text-base text-ink tabular-nums">
          {summary.lastWeight
            ? `${summary.lastWeight.pesoKg} kg · ${formatDate(summary.lastWeight.loggedAt)}`
            : COPY.summaryNoWeight}
        </p>
      </Card>
    </div>
  );
}
