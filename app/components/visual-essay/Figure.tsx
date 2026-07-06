import type { VisualEssayImage } from "./types";

export function Figure({
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
