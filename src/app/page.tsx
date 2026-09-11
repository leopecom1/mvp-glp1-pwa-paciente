import { Suspense } from "react";
import { HomeRedirect } from "@/components/HomeRedirect";

export default function IndexPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-canvas px-6">
          <p className="text-base text-muted">Abriendo tu espacio…</p>
        </div>
      }
    >
      <HomeRedirect />
    </Suspense>
  );
}
