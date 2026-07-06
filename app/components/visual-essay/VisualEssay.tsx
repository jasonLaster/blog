import type { ReactNode } from "react";
import { Figure } from "./Figure";
import type { VisualEssayImage } from "./types";

export function VisualEssay({ children }: { children: ReactNode }) {
  return (
    <article className="relative left-1/2 mt-5 w-[calc(100vw-2rem)] max-w-[980px] -translate-x-1/2">
      {children}
    </article>
  );
}

export function VisualEssayIntro({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[65ch] text-lg leading-8 text-zinc-300">
      {children}
    </div>
  );
}

export function VisualEssayHero({ image }: { image: VisualEssayImage }) {
  return (
    <Figure
      image={image}
      className="mt-8"
      imgClassName="aspect-[16/9] max-h-[560px]"
    />
  );
}

export function VisualEssayResult({
  title,
  image,
  children,
}: {
  title: string;
  image: VisualEssayImage;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 border-t border-zinc-800 pt-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
      <Figure image={image} imgClassName="aspect-[16/9]" />
      <div>
        <h2 className="text-xl font-medium text-zinc-100">{title}</h2>
        <div className="mt-3 text-base leading-7 text-zinc-300">
          {children}
        </div>
      </div>
    </section>
  );
}
