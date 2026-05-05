import { client } from "@/sanity/lib/client";
import { shootBySlugQuery, settingsQuery } from "@/sanity/lib/queries";
import { Nav } from "@/components/Nav";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";

export const revalidate = 60;

type ShootPhoto = {
  _id: string;
  image: object;
  alt?: string;
  location?: string;
  dateTaken?: string;
  tags?: string[];
  place?: { _id: string; name: string; slug?: string } | null;
};

type PlaceVisited = {
  _id: string;
  name: string;
  slug?: string;
  photosInThisShoot?: number;
};

type ShootDetail = {
  _id: string;
  title: string;
  slug: string;
  date?: string;
  description?: string;
  tags?: string[];
  wardrobe?: { notes?: string; colors?: string[]; items?: string[] };
  coverImage?: { _id: string; image: object; alt?: string };
  legacyPhotos?: (ShootPhoto | null)[];
  forwardPhotos?: (ShootPhoto | null)[];
  photos?: ShootPhoto[];
};

function unionPhotosById(
  ...arrs: ((ShootPhoto | null | undefined)[] | undefined)[]
): ShootPhoto[] {
  const seen = new Set<string>();
  const out: ShootPhoto[] = [];
  for (const arr of arrs) {
    for (const p of arr ?? []) {
      if (!p?.image || seen.has(p._id)) continue;
      seen.add(p._id);
      out.push(p);
    }
  }
  return out;
}

function derivePlacesVisited(photos: ShootPhoto[] | undefined): PlaceVisited[] {
  const map = new Map<string, PlaceVisited>();
  (photos ?? []).forEach((p) => {
    if (!p.place?._id) return;
    const existing = map.get(p.place._id);
    if (existing) {
      existing.photosInThisShoot = (existing.photosInThisShoot ?? 0) + 1;
    } else {
      map.set(p.place._id, {
        _id: p.place._id,
        name: p.place.name,
        slug: p.place.slug,
        photosInThisShoot: 1,
      });
    }
  });
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shoot = await client
    .fetch<ShootDetail | null>(shootBySlugQuery, { slug })
    .catch(() => null);
  if (!shoot) return { title: "Emily — Shoot" };
  return {
    title: `Emily — ${shoot.title}`,
    description: shoot.description?.slice(0, 160),
  };
}

export default async function ShootDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [shoot, settings] = await Promise.all([
    client
      .fetch<ShootDetail | null>(shootBySlugQuery, { slug })
      .catch(() => null),
    client.fetch(settingsQuery).catch(() => null),
  ]);

  if (!shoot) notFound();

  // Union legacy (shoot.photos[]) + forward (photo.shoot._ref) tagged photos.
  const livePhotos = unionPhotosById(shoot.legacyPhotos, shoot.forwardPhotos);
  shoot.photos = livePhotos;

  const name = settings?.name ?? "Emily";
  const cover = shoot.coverImage?.image
    ? urlFor(shoot.coverImage.image)
        .width(2000)
        .height(1200)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const places = derivePlacesVisited(livePhotos);

  return (
    <>
      <Nav name={name} />
      <main>
        <section className="relative h-[70svh] min-h-[460px] overflow-hidden flex items-end bg-[#0d0a06]">
          {cover ? (
            <Image
              src={cover}
              alt={shoot.coverImage?.alt ?? shoot.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-surface" />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,10,6,0.4) 0%, rgba(13,10,6,0) 35%, rgba(13,10,6,0.7) 80%, rgba(13,10,6,1) 100%)",
            }}
          />
          <div className="relative px-7 pb-12 max-w-5xl mx-auto w-full">
            <Link
              href="/shoots"
              className="kicker text-bone-dim hover:text-ember transition-colors"
            >
              ← Shoots
            </Link>
            <h1
              className="font-serif font-light text-bone mt-4"
              style={{ fontSize: "clamp(40px, 7vw, 80px)", lineHeight: 1.05 }}
            >
              {shoot.title}
            </h1>
            <div className="kicker text-bone-dim mt-3">{shoot.date}</div>
          </div>
        </section>

        <div className="px-7 py-12 max-w-5xl mx-auto space-y-12">
          {shoot.description && (
            <p className="text-ink-dim text-lg leading-relaxed font-light max-w-2xl">
              {shoot.description}
            </p>
          )}

          {places.length > 0 && (
            <section>
              <h3 className="kicker text-ember mb-3">Places visited</h3>
              <div className="flex flex-wrap gap-2">
                {places.map((p) => (
                  <Link
                    key={p._id}
                    href={`/gallery?place=${p.slug ?? ""}`}
                    className="px-3 py-1.5 text-[11px] tracking-wide uppercase border border-rule text-ink-dim hover:border-ember hover:text-ember transition-colors"
                  >
                    {p.name}
                    {p.photosInThisShoot ? (
                      <span className="text-ink-faint ml-2">
                        {p.photosInThisShoot}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {shoot.tags && shoot.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {shoot.tags.map((t) => (
                <Link
                  key={t}
                  href={`/gallery?tag=${encodeURIComponent(t)}`}
                  className="px-3 py-1 text-[11px] tracking-wide uppercase border border-rule text-ink-dim hover:border-ember hover:text-ember transition-colors"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}

          {shoot.wardrobe &&
            (shoot.wardrobe.notes ||
              shoot.wardrobe.colors?.length ||
              shoot.wardrobe.items?.length) && (
              <section>
                <h3 className="kicker text-ember mb-3">Wardrobe</h3>
                {shoot.wardrobe.notes && (
                  <p className="text-ink-dim text-sm leading-relaxed font-light max-w-2xl mb-4">
                    {shoot.wardrobe.notes}
                  </p>
                )}
                {shoot.wardrobe.items?.length ? (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {shoot.wardrobe.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-0.5 text-[10px] tracking-wide uppercase border border-rule text-ink-dim"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
                {shoot.wardrobe.colors?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {shoot.wardrobe.colors.map((color) => (
                      <Link
                        key={color}
                        href={`/gallery?color=${encodeURIComponent(color)}`}
                        className="px-2.5 py-0.5 text-[10px] tracking-wide uppercase border border-rule text-ink-dim hover:border-ember hover:text-ember transition-colors"
                      >
                        {color}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </section>
            )}

          {shoot.photos && shoot.photos.length > 0 && (
            <section>
              <h3 className="kicker text-ink-faint mb-4">Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {shoot.photos.map((p) => {
                  const src = urlFor(p.image)
                    .width(700)
                    .height(900)
                    .fit("crop")
                    .auto("format")
                    .url();
                  return (
                    <Link
                      key={p._id}
                      href={`/photos/${p._id}`}
                      className="block relative aspect-[3/4] overflow-hidden bg-surface group"
                    >
                      <Image
                        src={src}
                        alt={p.alt ?? shoot.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover brightness-95 group-hover:brightness-100 transition-all duration-300"
                      />
                      {p.place?.name && (
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/90 to-transparent text-[10px] tracking-kicker uppercase text-bone">
                          {p.place.name}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
