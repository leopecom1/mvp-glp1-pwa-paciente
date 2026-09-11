import Link from "next/link";

export function CheckInPill({
  href,
  title,
  hint,
}: {
  href: string;
  title: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[88px] items-center justify-between gap-4 rounded-[var(--radius-card)] border border-border bg-surface px-5 py-5 shadow-[var(--shadow-warm)] transition-colors hover:bg-surface-elevated"
    >
      <span>
        <span className="block font-display text-2xl text-ink">{title}</span>
        <span className="mt-1 block text-base text-muted">{hint}</span>
      </span>
      <span
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent"
      >
        →
      </span>
    </Link>
  );
}
