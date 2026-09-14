import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { DemoBanner } from "@/components/DemoBanner";
import { Disclaimer } from "@/components/Disclaimer";
import { FichaForm } from "@/components/FichaForm";

export const metadata: Metadata = {
  title: "Ficha mínima",
};

export default function FichaPage() {
  return (
    <AppShell banner={<DemoBanner />} footer={<Disclaimer />}>
      <FichaForm />
    </AppShell>
  );
}
