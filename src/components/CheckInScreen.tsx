"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { COPY } from "@/lib/copy";
import { acceptPath, useClientReady, useOnboarding } from "@/lib/onboarding";
import type { CheckInTipo } from "@/lib/types";
import { DoseCheckInForm } from "./DoseCheckInForm";
import { SymptomCheckInForm } from "./SymptomCheckInForm";
import { WeightCheckInForm } from "./WeightCheckInForm";
import { Button, Eyebrow } from "./ui";

const META: Record<CheckInTipo, { title: string; hint: string }> = {
  dosis: { title: COPY.pillDose, hint: COPY.pillDoseHint },
  sintomas: { title: COPY.pillGi, hint: COPY.pillGiHint },
  peso: { title: COPY.pillWeight, hint: COPY.pillWeightHint },
};

export function CheckInScreen({ tipo }: { tipo: CheckInTipo }) {
  const router = useRouter();
  const onboarding = useOnboarding();
  const clientReady = useClientReady();
  const item = META[tipo];

  useEffect(() => {
    if (!clientReady) return;
    if (!onboarding.accepted) {
      router.replace(acceptPath());
      return;
    }
    if (!onboarding.profileComplete) {
      router.replace("/ficha");
    }
  }, [clientReady, onboarding.accepted, onboarding.profileComplete, router]);

  return (
    <>
      <div className="space-y-3">
        <Eyebrow>{COPY.checkInEyebrow}</Eyebrow>
        <h1 className="font-display text-[2rem] leading-tight text-ink">{item.title}</h1>
        <p className="text-base text-muted">{item.hint}</p>
      </div>

      {tipo === "dosis" ? <DoseCheckInForm /> : null}
      {tipo === "sintomas" ? <SymptomCheckInForm /> : null}
      {tipo === "peso" ? <WeightCheckInForm /> : null}

      <Link href="/inicio" className="block">
        <Button type="button" variant="ghost">
          {COPY.backHome}
        </Button>
      </Link>
    </>
  );
}
