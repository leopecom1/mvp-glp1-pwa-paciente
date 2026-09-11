import { DISCLAIMER } from "@/lib/copy";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-base leading-6 text-muted ${className}`}>{DISCLAIMER}</p>
  );
}
