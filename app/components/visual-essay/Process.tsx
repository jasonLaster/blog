import type { ReactNode } from "react";
import { Figure } from "./Figure";
import type { VisualEssayImage, VisualEssayStepSummary } from "./types";

function ProcessRail({ steps }: { steps: VisualEssayStepSummary[] }) {
  return (
    <aside className="hidden w-32 shrink-0 pt-1 lg:block">
      <div className="sticky top-8">
        <p className="mb-5 text-sm text-zinc-500">Process</p>
        <ol className="space-y-5 border-l border-zinc-800 pl-5">
          {steps.map((step, index) => (
            <li key={step.number} className="relative">
              <span
                className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border ${
                  index === 0
                    ? "border-amber-400 bg-amber-400"
                    : "border-zinc-600 bg-zinc-950"
                }`}
              />
              <span className="block text-sm text-zinc-500">
                {step.number} {step.title}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

export function VisualEssayProcess({
  steps,
  children,
}: {
  steps: VisualEssayStepSummary[];
  children: ReactNode;
}) {
  return (
    <div className="mt-16 flex gap-12">
      <ProcessRail steps={steps} />
      <div className="min-w-0 flex-1 space-y-16">{children}</div>
    </div>
  );
}

export function VisualEssaySteps({ children }: { children: ReactNode }) {
  return <section className="space-y-14">{children}</section>;
}

export function VisualEssayStep({
  number,
  title,
  image,
  imageFirst = false,
  children,
}: {
  number: string;
  title: string;
  image: VisualEssayImage;
  imageFirst?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid gap-6 md:grid-cols-[minmax(0,0.82fr)_minmax(280px,1fr)] md:items-start ${
        imageFirst ? "md:[&>figure]:order-first" : ""
      }`}
    >
      <div>
        <p className="mb-2 text-sm tabular-nums text-amber-500">{number}</p>
        <h2 className="text-xl font-medium text-zinc-100">{title}</h2>
        <div className="mt-3 text-base leading-7 text-zinc-300">{children}</div>
      </div>
      <Figure image={image} imgClassName="aspect-[4/3]" />
    </div>
  );
}
