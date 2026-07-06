"use client";

import { useCallback, useEffect, useState } from "react";

type VisualEssayImage = {
  src: string;
  alt: string;
  caption?: string;
};

type VisualEssayChapter = {
  number: string;
  title: string;
  body: string;
  image: VisualEssayImage;
};

type VisualEssayAlongSection = {
  title: string;
  body: string;
  images: VisualEssayImage[];
  previewLimit?: number;
};

type VisualEssayProps = {
  intro: string;
  hero: VisualEssayImage;
  chapters: VisualEssayChapter[];
  alongSections: VisualEssayAlongSection[];
  result: {
    title: string;
    body: string;
    image: VisualEssayImage;
  };
};

type GalleryState = {
  title: string;
  images: VisualEssayImage[];
  index: number;
};

const DEFAULT_GALLERY_PREVIEW_LIMIT = 5;

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-[65ch]">
      {eyebrow && (
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-500/80">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-medium text-zinc-100">{title}</h2>
      <p className="mt-3 text-base leading-7 text-zinc-300">{body}</p>
    </div>
  );
}

function Figure({
  image,
  className = "",
  imgClassName = "",
}: {
  image: VisualEssayImage;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <figure className={className}>
      <img
        src={image.src}
        alt={image.alt}
        className={`block w-full rounded-md border border-white/10 object-cover ${imgClassName}`}
      />
      {image.caption && (
        <figcaption className="mt-2 text-sm leading-6 text-zinc-500">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

function GallerySection({
  section,
  openGallery,
}: {
  section: VisualEssayAlongSection;
  openGallery: (section: VisualEssayAlongSection, index: number) => void;
}) {
  const previewLimit = Math.max(
    section.previewLimit ?? DEFAULT_GALLERY_PREVIEW_LIMIT,
    2
  );
  const hasHiddenImages = section.images.length > previewLimit;
  const visibleCount = hasHiddenImages
    ? Math.max(previewLimit - 1, 1)
    : section.images.length;
  const visibleImages = section.images.slice(0, visibleCount);
  const hiddenCount = section.images.length - visibleCount;
  const moreImage = hasHiddenImages ? section.images[visibleCount] : null;

  return (
    <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
      {visibleImages.map((image, index) => (
        <button
          key={`${image.src}-${index}`}
          type="button"
          aria-label={`Open ${section.title} gallery: ${image.alt}`}
          className={`group text-left ${
            index === 0 && section.images.length > 4
              ? "col-span-2 row-span-2"
              : ""
          }`}
          onClick={() => openGallery(section, index)}
        >
          <img
            src={image.src}
            alt={image.alt}
            className={`block w-full rounded-md border border-white/10 object-cover transition duration-200 group-hover:border-amber-400/60 group-hover:brightness-110 ${
              index === 0 && section.images.length > 4
                ? "aspect-square"
                : "aspect-[4/3]"
            }`}
          />
        </button>
      ))}

      {moreImage && (
        <button
          type="button"
          aria-label={`Open ${section.title} gallery with ${hiddenCount} more images`}
          className="group relative text-left"
          onClick={() => openGallery(section, visibleCount)}
        >
          <img
            src={moreImage.src}
            alt={moreImage.alt}
            className="block aspect-[4/3] w-full rounded-md border border-white/10 object-cover brightness-50 transition duration-200 group-hover:border-amber-400/60 group-hover:brightness-75"
          />
          <span className="absolute inset-0 flex items-center justify-center rounded-md bg-zinc-950/25 text-lg font-medium text-zinc-50">
            +{hiddenCount}
          </span>
          <span className="sr-only">more</span>
        </button>
      )}
    </div>
  );
}

function GalleryModal({
  gallery,
  closeGallery,
  stepGallery,
}: {
  gallery: GalleryState | null;
  closeGallery: () => void;
  stepGallery: (step: number) => void;
}) {
  if (!gallery) {
    return null;
  }

  const activeImage = gallery.images[gallery.index];
  const hasMultipleImages = gallery.images.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${gallery.title} gallery`}
      className="fixed inset-0 z-50 flex bg-zinc-950/95 px-4 py-4 text-zinc-100 backdrop-blur-sm md:px-8 md:py-6"
      onClick={closeGallery}
    >
      <div
        className="mx-auto flex min-h-0 w-full max-w-6xl flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">{gallery.title}</p>
            <p className="mt-1 text-sm tabular-nums text-zinc-300">
              {gallery.index + 1} / {gallery.images.length}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close gallery"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-2xl text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-50"
            onClick={closeGallery}
          >
            ×
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          {hasMultipleImages && (
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-950/70 text-2xl text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
              onClick={() => stepGallery(-1)}
            >
              ‹
            </button>
          )}

          <figure className="flex min-h-0 w-full flex-col items-center">
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="h-[calc(100vh-11rem)] w-full rounded-md border border-white/10 object-contain md:h-[calc(100vh-10rem)]"
            />
            <figcaption className="mt-3 max-w-[65ch] text-center text-sm leading-6 text-zinc-400">
              {activeImage.caption ?? activeImage.alt}
            </figcaption>
          </figure>

          {hasMultipleImages && (
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-950/70 text-2xl text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
              onClick={() => stepGallery(1)}
            >
              ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProcessRail({ chapters }: { chapters: VisualEssayChapter[] }) {
  return (
    <aside className="hidden w-32 shrink-0 pt-1 lg:block">
      <div className="sticky top-8">
        <p className="mb-5 text-sm text-zinc-500">Process</p>
        <ol className="space-y-5 border-l border-zinc-800 pl-5">
          {chapters.map((chapter, index) => (
            <li key={chapter.number} className="relative">
              <span
                className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border ${
                  index === 0
                    ? "border-amber-400 bg-amber-400"
                    : "border-zinc-600 bg-zinc-950"
                }`}
              />
              <span className="block text-sm text-zinc-500">
                {chapter.number} {chapter.title}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

export function VisualEssay({
  intro,
  hero,
  chapters,
  alongSections,
  result,
}: VisualEssayProps) {
  const [gallery, setGallery] = useState<GalleryState | null>(null);

  const openGallery = useCallback(
    (section: VisualEssayAlongSection, index: number) => {
      setGallery({
        title: section.title,
        images: section.images,
        index,
      });
    },
    []
  );

  const closeGallery = useCallback(() => {
    setGallery(null);
  }, []);

  const stepGallery = useCallback((step: number) => {
    setGallery((currentGallery) => {
      if (!currentGallery) {
        return currentGallery;
      }

      const imageCount = currentGallery.images.length;
      return {
        ...currentGallery,
        index: (currentGallery.index + step + imageCount) % imageCount,
      };
    });
  }, []);

  useEffect(() => {
    if (!gallery) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        stepGallery(-1);
      }

      if (event.key === "ArrowRight") {
        stepGallery(1);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeGallery, gallery, stepGallery]);

  useEffect(() => {
    if (!gallery) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [gallery]);

  return (
    <>
      <article className="relative left-1/2 mt-5 w-[calc(100vw-2rem)] max-w-[980px] -translate-x-1/2">
        <div className="mx-auto max-w-[65ch]">
          <p className="text-lg leading-8 text-zinc-300">{intro}</p>
        </div>

        <Figure
          image={hero}
          className="mt-8"
          imgClassName="aspect-[16/9] max-h-[560px]"
        />

        <div className="mt-16 flex gap-12">
          <ProcessRail chapters={chapters} />
          <div className="min-w-0 flex-1 space-y-16">
            <section className="space-y-14">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.number}
                  className={`grid gap-6 md:grid-cols-[minmax(0,0.82fr)_minmax(280px,1fr)] md:items-start ${
                    index % 2 === 1 ? "md:[&>figure]:order-first" : ""
                  }`}
                >
                  <div>
                    <p className="mb-2 text-sm tabular-nums text-amber-500">
                      {chapter.number}
                    </p>
                    <h2 className="text-xl font-medium text-zinc-100">
                      {chapter.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-zinc-300">
                      {chapter.body}
                    </p>
                  </div>
                  <Figure image={chapter.image} imgClassName="aspect-[4/3]" />
                </div>
              ))}
            </section>

            {alongSections.map((section, sectionIndex) => (
              <section
                key={section.title}
                className="border-t border-zinc-800 pt-10"
              >
                <SectionHeader
                  eyebrow={
                    sectionIndex === 0
                      ? "Along the way"
                      : `Along the way 0${sectionIndex + 1}`
                  }
                  title={section.title}
                  body={section.body}
                />
                <GallerySection
                  section={section}
                  openGallery={openGallery}
                />
              </section>
            ))}

            <section className="grid gap-6 border-t border-zinc-800 pt-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <Figure image={result.image} imgClassName="aspect-[16/9]" />
              <div>
                <h2 className="text-xl font-medium text-zinc-100">
                  {result.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-zinc-300">
                  {result.body}
                </p>
              </div>
            </section>
          </div>
        </div>
      </article>

      <GalleryModal
        gallery={gallery}
        closeGallery={closeGallery}
        stepGallery={stepGallery}
      />
    </>
  );
}
