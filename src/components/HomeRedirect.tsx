"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadOnboarding } from "@/lib/onboarding";

export function HomeRedirect() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const state = loadOnboarding();
    const query = params.toString();
    const suffix = query ? `?${query}` : "";

    if (state.profileComplete) {
      router.replace(`/inicio${suffix}`);
      return;
    }
    if (state.accepted) {
      router.replace(`/ficha${suffix}`);
      return;
    }
    router.replace(`/aceptar${suffix}`);
  }, [params, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-6">
      <p className="text-base text-muted">Abriendo tu espacio…</p>
    </div>
  );
}
