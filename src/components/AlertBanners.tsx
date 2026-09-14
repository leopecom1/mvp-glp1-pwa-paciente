"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listOpenAlerts } from "@/lib/api";
import { alertsForPatientBanners, patientBannerCopy } from "@/lib/alerts";
import { demoForceEmptyAlerts, subscribeAlerts } from "@/lib/alerts-demo";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { isApiConfigured } from "@/lib/env";
import type { PatientSafeAlert } from "@/lib/types";
import { EmptyState } from "./EmptyState";

function Banner({ alert }: { alert: PatientSafeAlert }) {
  const isP0 = alert.severity === "P0";
  const isP2 = alert.severity === "P2";
  const title = isP0 ? COPY.alertP0Title : isP2 ? COPY.alertP2Title : COPY.alertP1Title;
  const message = patientBannerCopy(alert);

  return (
    <section
      className={`rounded-[var(--radius-card)] border px-5 py-5 shadow-[var(--shadow-warm)] ${
        isP0
          ? "border-alert bg-alert-subtle"
          : isP2
            ? "border-border bg-surface"
            : "border-border bg-accent-subtle"
      }`}
      aria-label={`${title}. ${message}`}
    >
      <p
        className={`text-base font-medium uppercase tracking-[0.12em] ${
          isP0 ? "text-alert" : "text-muted"
        }`}
      >
        {title}
      </p>
      <p className="mt-2 text-base text-ink">{message}</p>
      {isP2 ? (
        <Link
          href="/inicio#check-in"
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-accent px-5 text-base font-medium text-white hover:bg-accent-hover"
        >
          {COPY.alertCheckInCta}
        </Link>
      ) : null}
    </section>
  );
}

export function AlertBanners() {
  const { session } = useAuth();
  const [alerts, setAlerts] = useState<PatientSafeAlert[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const vacio = new URLSearchParams(window.location.search).get("vacio") === "1";
    if (vacio && !isApiConfigured()) {
      demoForceEmptyAlerts();
    }

    const load = () => {
      listOpenAlerts(session?.accessToken ?? null).then((rows) => {
        if (cancelled) return;
        setAlerts(alertsForPatientBanners(rows));
        setLoaded(true);
      });
    };

    load();
    const unsubscribe = subscribeAlerts(load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [session?.accessToken]);

  if (!loaded) {
    return <div className="min-h-[7.5rem]" />;
  }

  if (alerts.length === 0) {
    return (
      <div role="status" aria-label={COPY.alertsEmptyTitle}>
        <EmptyState title={COPY.alertsEmptyTitle}>{COPY.alertsEmpty}</EmptyState>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" aria-label="Avisos abiertos" role="region">
      {alerts.map((alert) => (
        <Banner key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
