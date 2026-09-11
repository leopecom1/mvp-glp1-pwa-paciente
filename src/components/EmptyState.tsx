import type { ReactNode } from "react";

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[var(--radius-card)] bg-accent-subtle/60 px-5 py-6">
      <span
        aria-hidden
        className="h-10 w-16 rounded-full bg-gradient-to-br from-accent-subtle via-surface-elevated to-[#f3e6c9]"
      />
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <p className="text-base text-muted">{children}</p>
    </div>
  );
}
