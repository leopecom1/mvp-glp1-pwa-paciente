import type { ReactNode } from "react";
import { COPY } from "@/lib/copy";

export function AppShell({
  children,
  footer,
  banner,
}: {
  children: ReactNode;
  footer?: ReactNode;
  banner?: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pb-10 pt-6">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-4 focus:z-10 focus:rounded-2xl focus:bg-surface focus:px-4 focus:py-2 focus:text-base focus:text-ink"
      >
        Ir al contenido
      </a>
      <header className="mb-5 flex items-center gap-3">
        <div
          aria-hidden
          className="flex size-11 items-center justify-center rounded-2xl bg-accent-subtle text-lg font-medium text-accent"
        >
          K
        </div>
        <div>
          <p className="text-base text-muted">{COPY.appName}</p>
          <p className="text-base font-medium text-ink">{COPY.appShortName}</p>
        </div>
      </header>
      {banner}
      <main id="contenido" className="flex flex-1 flex-col gap-6">
        {children}
      </main>
      {footer ? <footer className="mt-10">{footer}</footer> : null}
    </div>
  );
}
