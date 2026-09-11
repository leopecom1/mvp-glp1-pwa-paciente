import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <AppShell>
      <EmptyState title="Esta página no está">
        Quizá el enlace cambió. Puedes volver al inicio y continuar desde ahí.
      </EmptyState>
      <Link href="/" className="block">
        <Button type="button">Ir al inicio</Button>
      </Link>
    </AppShell>
  );
}
