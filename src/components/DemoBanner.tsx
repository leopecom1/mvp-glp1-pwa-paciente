"use client";

import { COPY } from "@/lib/copy";
import { useAuth } from "@/lib/auth";
import { isApiConfigured } from "@/lib/env";

export function DemoBanner() {
  const { stub } = useAuth();
  if (!stub && isApiConfigured()) return null;

  return (
    <p className="mb-4 rounded-2xl bg-accent-subtle px-4 py-3 text-base text-ink">
      {COPY.demoBanner}
    </p>
  );
}
