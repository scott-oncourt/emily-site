"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { CambodiaMap, type PlaceLite } from "./CambodiaMap";

type PlacePhoto = {
  _id: string;
  image: object;
  alt?: string;
  location?: string;
  dateTaken?: string;
};

type PlaceShoot = {
  _id: string;
  title: string;
  slug: string;
  date?: string;
  coverImage?: { _id: string; image: object; alt?: string };
  photoCount?: number;
};

type Post = {
  title?: string;
  date?: string;
  body?: string;
  link?: string;
};

export type Place = PlaceLite & {
  slug?: string;
  projectInfo?: string;
  photos?: PlacePhoto[];
  shoots?: PlaceShoot[];
  posts?: Post[];
};

export function MapClient({ places }: { places: Place[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = places.find((p) => p._id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] h-[calc(100svh-72px)] min-h-[560px]">
      <div className="relative order-2 lg:order-1 min-h-[360px]">
        <CambodiaMap
          places={places}
          selectedId={selectedId}
          onSelect={(p) => setSelectedId(p._id)}
          className="absolute inset-0"
        />
      </div>

      <aside className="order-1 lg:order-2 bg-paper border-l border-rule overflow-y-auto">
        {selected ? (
          <PlacePanel place={selected} onClose={() => setSelectedId(null)} />
        ) : (
          <PlaceList places={places} onPick={(p) => setSelectedId(p._id)} />
        )}
      </aside>
    </div>
  );
}

function KindLabel({ kind }: { kind: PlaceLite["kind"] }) {
  const text =
    kind === "both" ? "Visit · Project" : kind === "project" ? "Project" : "Visit";
  return <span className="kicker text-ember">{text}</span>;
}

function PlacePanel({ place, onClose }: { place: Place; onClose: () => void }) {
  return (
    <div className="p-7 space-y-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <KindLabel kind={place.kind} />
          <h2 className="font-serif font-light text-ink text-3xl leading-tight mt-3">
            {place.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close place details"
          className="text-ink-faint hover:text-ember transition-colors text-2xl leading-none mt-1"
        >
          ×
        </button>
      </div>

      {place.blurb && (
        <p className="text-ink-dim text-[15px] leading-relaxed font-light">
          {place.blurb}
        </p>
      )}

      {place.shoots && place.shoots.length > 0 && (
        <section>
          <h3 className="kicker text-ink-faint mb-3">Shoots from here</h3>
          <ul className="space-y-3">
            {place.shoots.map((shoot) => {
              const cover = shoot.coverImage
                ? urlFor(shoot.coverImage.image)
                    .width(160)
                    .height(160)
                    .fit("crop")
                    .auto("format")
                    .url()
                : null;
              return (
                <li key={shoot._id}>
                  <Link
                    href={`/shoots/${shoot.slug}`}
                    className="flex gap-3 items-center group"
                  >
                    <div className="relative w-16 h-16 shrink-0 bg-surface overflow-hidden">
                      {cover && (
                        <Image
                          src={cover}
                          alt={shoot.coverImage?.alt ?? shoot.title}
                          fill
                          sizes="64px"
                          className="object-cover brightness-95 group-hover:brightness-100 transition-all"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif text-ink text-base leading-tight group-hover:text-ember transition-colors truncate">
                        {shoot.title}
                      </div>
                      <div className="kicker text-ink-faint mt-1">
                        {[
                          shoot.date,
                          shoot.photoCount && `${shoot.photoCount} photos`,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {place.photos && place.photos.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="kicker text-ink-faint">Images</h3>
            {place.slug && (
              <Link
                href={`/gallery?place=${place.slug}`}
                className="kicker text-ember hover:underline"
              >
                See all →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {place.photos.map((p) => {
              const url = urlFor(p.image)
                .width(400)
                .height(400)
                .fit("crop")
                .auto("format")
                .url();
              return (
                <Link
                  key={p._id}
                  href={`/photos/${p._id}`}
                  className="relative aspect-square overflow-hidden bg-surface block group"
                >
                  <Image
                    src={url}
                    alt={p.alt ?? ""}
                    fill
                    className="object-cover brightness-95 group-hover:brightness-100 transition-all"
                    sizes="220px"
                  />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {place.posts && place.posts.length > 0 && (
        <section>
          <h3 className="kicker text-ink-faint mb-3">Posts</h3>
          <ul className="space-y-5">
            {place.posts.map((post, i) => (
              <li key={i} className="border-l border-ember-dim pl-4 py-1">
                {post.title && (
                  <div className="text-ink font-serif text-lg leading-snug">
                    {post.title}
                  </div>
                )}
                {post.date && (
                  <div className="kicker text-ink-faint mt-1">{post.date}</div>
                )}
                {post.body && (
                  <p className="text-ink-dim text-sm leading-relaxed mt-2 whitespace-pre-line">
                    {post.body}
                  </p>
                )}
                {post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kicker text-ember mt-3 inline-block hover:underline"
                  >
                    Read more →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(place.kind === "project" || place.kind === "both") &&
        place.projectInfo && (
          <section>
            <h3 className="kicker text-ink-faint mb-3">Project</h3>
            <p className="text-ink-dim text-sm leading-relaxed whitespace-pre-line font-light">
              {place.projectInfo}
            </p>
          </section>
        )}
    </div>
  );
}

function PlaceList({
  places,
  onPick,
}: {
  places: Place[];
  onPick: (p: Place) => void;
}) {
  return (
    <div className="p-7">
      <span className="kicker text-ember mb-3 block">Cambodia</span>
      <h2 className="font-serif font-light text-ink text-3xl mb-2">
        Where Emily <em className="italic">goes</em>
      </h2>
      <p className="text-ink-dim text-sm mb-6 font-light">
        Pick a pin on the map, or a place below.
      </p>
      <ul className="divide-y divide-rule">
        {places.map((place) => (
          <li key={place._id}>
            <button
              onClick={() => onPick(place)}
              className="w-full text-left py-3 px-2 -mx-2 hover:bg-surface/40 transition-colors group"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-serif text-ink text-lg group-hover:text-ember transition-colors">
                  {place.name}
                </div>
                <span className="kicker text-ink-faint">
                  {place.kind === "both"
                    ? "V·P"
                    : place.kind === "project"
                      ? "Proj"
                      : "Visit"}
                </span>
              </div>
              {place.blurb && (
                <div className="text-ink-dim text-xs mt-1 line-clamp-2">
                  {place.blurb}
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
