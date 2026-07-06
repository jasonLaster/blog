"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";
import type { VisualEssayImage } from "./types";

type GalleryState = {
  index: number;
};

const DEFAULT_GALLERY_PREVIEW_LIMIT = 5;

function GalleryModal({
  title,
  images,
  gallery,
  closeGallery,
  stepGallery,
}: {
  title: string;
  images: VisualEssayImage[];
  gallery: GalleryState | null;
  closeGallery: () => void;
  stepGallery: (step: number) => void;
}) {
  if (!gallery) {
    return null;
  }

  const activeImage = images[gallery.index];
  const hasMultipleImages = images.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      className="fixed inset-0 z-50 flex bg-zinc-950/95 px-4 py-4 text-zinc-100 backdrop-blur-sm md:px-8 md:py-6"
      onClick={closeGallery}
    >
      <div
        className="mx-auto flex min-h-0 w-full max-w-6xl flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">{title}</p>
            <p className="mt-1 text-sm tabular-nums text-zinc-300">
              {gallery.index + 1} / {images.length}
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

export function VisualEssayGallery({
  eyebrow = "Along the way",
  title,
  images,
  previewLimit = DEFAULT_GALLERY_PREVIEW_LIMIT,
  children,
}: {
  eyebrow?: string;
  title: string;
  images: VisualEssayImage[];
  previewLimit?: number;
  children: ReactNode;
}) {
  const [gallery, setGallery] = useState<GalleryState | null>(null);
  const safePreviewLimit = Math.max(previewLimit, 2);
  const hasHiddenImages = images.length > safePreviewLimit;
  const visibleCount = hasHiddenImages
    ? Math.max(safePreviewLimit - 1, 1)
    : images.length;
  const visibleImages = images.slice(0, visibleCount);
  const hiddenCount = images.length - visibleCount;
  const moreImage = hasHiddenImages ? images[visibleCount] : null;

  const closeGallery = useCallback(() => {
    setGallery(null);
  }, []);

  const stepGallery = useCallback(
    (step: number) => {
      setGallery((currentGallery) => {
        if (!currentGallery) {
          return currentGallery;
        }

        return {
          index: (currentGallery.index + step + images.length) % images.length,
        };
      });
    },
    [images.length]
  );

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
    <section className="border-t border-zinc-800 pt-10">
      <SectionHeader eyebrow={eyebrow} title={title}>
        {children}
      </SectionHeader>

      <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
        {visibleImages.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            aria-label={`Open ${title} gallery: ${image.alt}`}
            className={`group text-left ${
              index === 0 && images.length > 4 ? "col-span-2 row-span-2" : ""
            }`}
            onClick={() => setGallery({ index })}
          >
            <img
              src={image.src}
              alt={image.alt}
              className={`block w-full rounded-md border border-white/10 object-cover transition duration-200 group-hover:border-amber-400/60 group-hover:brightness-110 ${
                index === 0 && images.length > 4
                  ? "aspect-square"
                  : "aspect-[4/3]"
              }`}
            />
          </button>
        ))}

        {moreImage && (
          <button
            type="button"
            aria-label={`Open ${title} gallery with ${hiddenCount} more images`}
            className="group relative text-left"
            onClick={() => setGallery({ index: visibleCount })}
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

      <GalleryModal
        title={title}
        images={images}
        gallery={gallery}
        closeGallery={closeGallery}
        stepGallery={stepGallery}
      />
    </section>
  );
}
