import type { Metadata } from "next";
import { Suspense } from "react";
import { AcceptConsentForm } from "@/components/AcceptConsentForm";
import { AppShell } from "@/components/AppShell";
import { DemoBanner } from "@/components/DemoBanner";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Unirte a tu clínica",
};

export default function AceptarPage() {
  return (
    <AppShell banner={<DemoBanner />} footer={<Disclaimer />}>
      <Suspense fallback={<p className="text-base text-muted">Cargando invitación…</p>}>
        <AcceptConsentForm />
      </Suspense>
    </AppShell>
  );
}
