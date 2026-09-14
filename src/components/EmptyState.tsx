import type { ReactNode } from "react";

const TONE_BAR = {
  calm: "bg-success-soft/70",
  accent: "bg-accent/50",
  alert: "bg-alert/70",
} as const;

export function EmptyState({
  title,
  children,
  actions,
  tone = "calm",
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  tone?: keyof typeof TONE_BAR;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-[var(--radius-card)] border border-border bg-surface px-5 py-6 shadow-[var(--shadow-warm)]">
      <span aria-hidden className={`h-3 w-14 rounded-full ${TONE_BAR[tone]}`} />
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <div className="text-base text-muted">{children}</div>
      {actions ? (
        <div className="mt-1 flex w-full flex-col items-start gap-1">{actions}</div>
      ) : null}
    </div>
  );
}
