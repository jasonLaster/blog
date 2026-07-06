import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-[65ch]">
      {eyebrow && (
        <p className="mb-2 text-xs uppercase text-amber-500/80">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-medium text-zinc-100">{title}</h2>
      <div className="mt-3 text-base leading-7 text-zinc-300">{children}</div>
    </div>
  );
}
