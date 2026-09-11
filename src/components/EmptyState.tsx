import type { ReactNode } from "react";

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[var(--radius-card)] border border-border bg-surface px-5 py-6 shadow-[var(--shadow-warm)]">
      <span
        aria-hidden
        className="h-3 w-14 rounded-full bg-success-soft/70"
      />
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <p className="text-base text-muted">{children}</p>
    </div>
  );
}
