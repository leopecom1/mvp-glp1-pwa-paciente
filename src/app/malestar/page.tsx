import type { Metadata } from "next";
import Link from "next/link";
import { AdverseEventForm } from "@/components/AdverseEventForm";
import { AppShell } from "@/components/AppShell";
import { DemoBanner } from "@/components/DemoBanner";
import { Disclaimer } from "@/components/Disclaimer";
import { Button, Eyebrow } from "@/components/ui";
import { COPY } from "@/lib/copy";

export const metadata: Metadata = {
  title: COPY.eaTitle,
};

export default function MalestarPage() {
  return (
    <AppShell banner={<DemoBanner />} footer={<Disclaimer />}>
      <div className="space-y-3">
        <Eyebrow>{COPY.eaEyebrow}</Eyebrow>
        <h1 className="font-display text-[2rem] leading-tight text-ink">{COPY.eaTitle}</h1>
      </div>
      <AdverseEventForm />
      <Link href="/inicio" className="block">
        <Button type="button" variant="ghost">
          {COPY.backHome}
        </Button>
      </Link>
    </AppShell>
  );
}
