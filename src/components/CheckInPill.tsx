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
      className="flex min-h-[108px] items-center justify-between gap-4 rounded-[var(--radius-card)] border border-border bg-surface px-5 py-6 shadow-[var(--shadow-warm)] transition-colors hover:bg-surface-elevated"
    >
      <span className="flex items-start gap-4">
        <span
          aria-hidden
          className="mt-1 h-10 w-1.5 shrink-0 rounded-full bg-success-soft"
        />
        <span>
          <span className="block font-display text-[1.75rem] leading-tight text-ink">
            {title}
          </span>
          <span className="mt-1 block text-base text-muted">{hint}</span>
        </span>
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
