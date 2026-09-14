import { Field } from "./ui";

export function ScaleField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={`${label}: ${value}`} hint={hint} htmlFor={id}>
      <input
        id={id}
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={value}
        aria-valuetext={`${value} de 10`}
        className="min-h-11 w-full accent-accent"
      />
      <span className="flex justify-between text-base text-muted">
        <span>0</span>
        <span>10</span>
      </span>
    </Field>
  );
}
