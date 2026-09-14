import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-warm)] ${className}`}
    >
      {children}
    </section>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "alert";
}) {
  const styles =
    variant === "primary"
      ? "bg-accent text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-accent/40 disabled:text-white/80"
      : variant === "alert"
        ? "bg-alert text-white hover:bg-alert/90 disabled:cursor-not-allowed disabled:bg-alert/40 disabled:text-white/80"
        : "bg-transparent text-ink hover:bg-accent-subtle disabled:text-muted";

  return (
    <button
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-5 text-base font-medium transition-colors ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2" htmlFor={htmlFor}>
      <span className="text-base font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="text-base text-muted">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`min-h-11 w-full rounded-2xl border border-border bg-surface-elevated px-4 text-base text-ink placeholder:text-muted ${props.className ?? ""}`}
    />
  );
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`min-h-11 w-full rounded-2xl border border-border bg-surface-elevated px-4 text-base text-ink ${props.className ?? ""}`}
    />
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-base font-medium uppercase tracking-[0.12em] text-muted">
      {children}
    </p>
  );
}

export function ChoiceButton({
  selected,
  children,
  tone = "accent",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  selected: boolean;
  tone?: "accent" | "alert";
}) {
  const selectedStyles =
    tone === "alert"
      ? "border-alert bg-alert-subtle text-ink"
      : "border-accent bg-accent-subtle text-ink";

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`min-h-11 w-full rounded-2xl border px-4 py-3 text-left text-base transition-colors ${
        selected ? selectedStyles : "border-border bg-surface text-ink"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
