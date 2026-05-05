"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";

export type GalleryPhoto = {
  _id: string;
  image: object;
  alt?: string;
  location?: string;
  dateTaken?: string;
  tags?: string[];
  place?: { _id: string; name: string; slug?: string } | null;
  shoot?: {
    _id: string;
    title: string;
    slug: string;
    date?: string;
    tags?: string[];
    wardrobe?: { notes?: string; colors?: string[]; items?: string[] };
  } | null;
};

export type GalleryFeed = {
  photos: GalleryPhoto[];
  places: Array<{ _id: string; name: string; slug?: string }>;
  tagsFromShoots: string[];
  tagsFromPhotos: string[];
  colors: string[];
};

export function GalleryClient({ feed }: { feed: GalleryFeed }) {
  const router = useRouter();
  const params = useSearchParams();

  const placeFilter = params.get("place");
  const tagFilter = params.get("tag");
  const colorFilter = params.get("color");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    [...feed.tagsFromShoots, ...feed.tagsFromPhotos].forEach((t) => {
      if (t) set.add(t);
    });
    return [...set].sort();
  }, [feed.tagsFromShoots, feed.tagsFromPhotos]);

  const allColors = useMemo(
    () => [...new Set((feed.colors ?? []).filter(Boolean))].sort(),
    [feed.colors],
  );

  const filtered = useMemo(() => {
    return feed.photos.filter((p) => {
      if (placeFilter && p.place?.slug !== placeFilter) return false;
      if (tagFilter) {
        const photoTags = p.tags ?? [];
        const shootTags = p.shoot?.tags ?? [];
        if (![...photoTags, ...shootTags].includes(tagFilter)) return false;
      }
      if (colorFilter) {
        const colors = p.shoot?.wardrobe?.colors ?? [];
        if (!colors.includes(colorFilter)) return false;
      }
      return true;
    });
  }, [feed.photos, placeFilter, tagFilter, colorFilter]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || next.get(key) === value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    const qs = next.toString();
    router.replace(qs ? `/gallery?${qs}` : "/gallery", { scroll: false });
  };

  const clear = () => router.replace("/gallery", { scroll: false });
  const hasFilters = !!(placeFilter || tagFilter || colorFilter);

  return (
    <div className="px-7 pb-20">
      <div className="max-w-6xl mx-auto">
        <header className="pt-12 pb-10">
          <span className="kicker text-ember mb-3 block">Photography</span>
          <h1 className="font-serif font-light text-ink text-4xl md:text-6xl leading-[1.05]">
            Sessions
          </h1>
          <p className="text-ink-dim text-sm mt-3 max-w-lg font-light">
            Every shoot, every place. Filter by where Emily was or what she was
            wearing.
          </p>
        </header>

        <div className="mb-8 space-y-5">
          <FilterRow label="Place">
            {feed.places.map((place) => (
              <Chip
                key={place._id}
                active={placeFilter === place.slug}
                onClick={() => setParam("place", place.slug ?? null)}
              >
                {place.name}
              </Chip>
            ))}
          </FilterRow>

          {allTags.length > 0 && (
            <FilterRow label="Tag">
              {allTags.map((tag) => (
                <Chip
                  key={tag}
                  active={tagFilter === tag}
                  onClick={() => setParam("tag", tag)}
                >
                  {tag}
                </Chip>
              ))}
            </FilterRow>
          )}

          {allColors.length > 0 && (
            <FilterRow label="Colour">
              {allColors.map((color) => (
                <Chip
                  key={color}
                  active={colorFilter === color}
                  onClick={() => setParam("color", color)}
                >
                  {color}
                </Chip>
              ))}
            </FilterRow>
          )}

          {hasFilters && (
            <button
              onClick={clear}
              className="text-[10px] tracking-kicker uppercase text-ink-faint hover:text-ember transition-colors"
            >
              × Clear filters
            </button>
          )}
        </div>

        <p className="kicker text-ink-faint mb-4">
          {filtered.length} {filtered.length === 1 ? "photo" : "photos"}
        </p>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-ink-dim font-serif text-xl">
            No photos match these filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((photo) => (
              <PhotoTile key={photo._id} photo={photo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className="kicker text-ink-faint shrink-0 w-12">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-[11px] tracking-wide uppercase border transition-colors max-w-[20rem] text-left leading-snug ${
        active
          ? "border-ember bg-ember/10 text-ember"
          : "border-rule text-ink-dim hover:border-ember-dim hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function PhotoTile({ photo }: { photo: GalleryPhoto }) {
  const src = urlFor(photo.image).width(600).height(800).fit("crop").auto("format").url();
  return (
    <Link
      href={`/photos/${photo._id}`}
      className="block relative aspect-[3/4] overflow-hidden bg-surface group"
    >
      <Image
        src={src}
        alt={photo.alt ?? photo.shoot?.title ?? ""}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover brightness-95 group-hover:brightness-100 transition-all duration-300"
      />
      {(photo.shoot?.title || photo.place?.name) && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          {photo.shoot?.title && (
            <div className="text-bone text-sm font-serif">
              {photo.shoot.title}
            </div>
          )}
          {photo.place?.name && (
            <div className="text-bone-dim text-[10px] tracking-kicker uppercase mt-0.5">
              {photo.place.name}
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
