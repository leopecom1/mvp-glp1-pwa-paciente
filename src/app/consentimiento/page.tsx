import type { Metadata } from "next";
import { Suspense } from "react";
import { AcceptConsentForm } from "@/components/AcceptConsentForm";
import { AppShell } from "@/components/AppShell";
import { DemoBanner } from "@/components/DemoBanner";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Consentimiento de datos",
};

/** Consent gate (`tratamiento_datos` only). Same flow as /aceptar. */
export default function ConsentimientoPage() {
  return (
    <AppShell banner={<DemoBanner />} footer={<Disclaimer />}>
      <Suspense fallback={<p className="text-base text-muted">Cargando consentimiento…</p>}>
        <AcceptConsentForm />
      </Suspense>
    </AppShell>
  );
}
