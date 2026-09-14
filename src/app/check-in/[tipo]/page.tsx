import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CheckInScreen } from "@/components/CheckInScreen";
import { DemoBanner } from "@/components/DemoBanner";
import { Disclaimer } from "@/components/Disclaimer";
import { COPY } from "@/lib/copy";
import type { CheckInTipo } from "@/lib/types";

const CHECK_INS: Record<CheckInTipo, { title: string; hint: string }> = {
  dosis: { title: COPY.pillDose, hint: COPY.pillDoseHint },
  sintomas: { title: COPY.pillGi, hint: COPY.pillGiHint },
  peso: { title: COPY.pillWeight, hint: COPY.pillWeightHint },
};

type PageProps = {
  params: Promise<{ tipo: string }>;
};

function isCheckInTipo(value: string): value is CheckInTipo {
  return value === "dosis" || value === "sintomas" || value === "peso";
}

export async function generateStaticParams() {
  return (Object.keys(CHECK_INS) as CheckInTipo[]).map((tipo) => ({ tipo }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tipo } = await params;
  const item = isCheckInTipo(tipo) ? CHECK_INS[tipo] : null;
  return { title: item?.title ?? "Check-in" };
}

export default async function CheckInPage({ params }: PageProps) {
  const { tipo } = await params;
  if (!isCheckInTipo(tipo)) notFound();

  return (
    <AppShell banner={<DemoBanner />} footer={<Disclaimer />}>
      <CheckInScreen tipo={tipo} />
    </AppShell>
  );
}
