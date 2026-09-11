import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui";
import { COPY } from "@/lib/copy";

const CHECK_INS = {
  dosis: { title: COPY.pillDose, hint: COPY.pillDoseHint },
  sintomas: { title: COPY.pillGi, hint: COPY.pillGiHint },
  peso: { title: COPY.pillWeight, hint: COPY.pillWeightHint },
} as const;

type CheckInTipo = keyof typeof CHECK_INS;

type PageProps = {
  params: Promise<{ tipo: string }>;
};

export async function generateStaticParams() {
  return Object.keys(CHECK_INS).map((tipo) => ({ tipo }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tipo } = await params;
  const item = CHECK_INS[tipo as CheckInTipo];
  return { title: item?.title ?? "Check-in" };
}

export default async function CheckInStubPage({ params }: PageProps) {
  const { tipo } = await params;
  const item = CHECK_INS[tipo as CheckInTipo];
  if (!item) notFound();

  return (
    <AppShell>
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted">
          Check-in
        </p>
        <h1 className="font-display text-[2rem] leading-tight text-ink">{item.title}</h1>
        <p className="text-base text-muted">{item.hint}</p>
      </div>
      <EmptyState title={COPY.stubSoonTitle}>{COPY.stubSoonBody}</EmptyState>
      <Link href="/inicio" className="block">
        <Button type="button" variant="ghost">
          {COPY.backHome}
        </Button>
      </Link>
    </AppShell>
  );
}
