import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type Photo = {
  _id: string;
  image: object;
  alt?: string;
  location?: string;
};

export function Gallery({ photos }: { photos: Photo[] }) {
  if (!photos.length) return null;

  const col1 = photos.filter((_, i) => i % 2 === 0);
  const col2 = photos.filter((_, i) => i % 2 === 1);

  return (
    <section id="gallery" className="bg-surface px-4 py-20">
      <div className="px-3 mb-10 max-w-4xl mx-auto flex flex-col gap-3 md:flex-row md:justify-between md:items-baseline">
        <span className="kicker text-ember">Photography</span>
        <h2 className="font-serif font-light text-ink text-4xl md:text-5xl leading-none">
          Sessions
        </h2>
      </div>

      <div className="max-w-4xl mx-auto flex gap-2">
        {[col1, col2].map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-2">
            {col.map((photo) => {
              const src = urlFor(photo.image).width(800).auto("format").url();
              return (
                <Link
                  key={photo._id}
                  href={`/photos/${photo._id}`}
                  className="block overflow-hidden group focus:outline-none"
                >
                  <Image
                    src={src}
                    alt={photo.alt ?? photo.location ?? ""}
                    width={600}
                    height={900}
                    className="w-full h-auto object-cover brightness-95 group-hover:brightness-100 transition-all duration-300"
                  />
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-3 mt-10 flex flex-wrap items-center justify-between gap-3 text-[11px] tracking-widest uppercase">
        <Link
          href="/gallery"
          className="text-ink-dim hover:text-ember transition-colors"
        >
          View all photos →
        </Link>
        <Link
          href="/shoots"
          className="text-ink-dim hover:text-ember transition-colors"
        >
          Browse by shoot →
        </Link>
      </div>
    </section>
  );
}
