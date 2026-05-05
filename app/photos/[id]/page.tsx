import { client } from "@/sanity/lib/client";
import {
  photoByIdQuery,
  morePhotosAtPlaceQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import { Nav } from "@/components/Nav";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";

export const revalidate = 60;

type Wardrobe = { notes?: string; colors?: string[]; items?: string[] };

type PhotoDetail = {
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
    wardrobe?: Wardrobe;
    siblings?: Array<{ _id: string; image: object; alt?: string }>;
  } | null;
};

type RelatedPhoto = {
  _id: string;
  image: object;
  alt?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await client
    .fetch<PhotoDetail | null>(photoByIdQuery, { id })
    .catch(() => null);
  if (!photo) return { title: "Emily — Photo" };
  return {
    title: photo.shoot?.title
      ? `Emily — ${photo.shoot.title}`
      : photo.place?.name
        ? `Emily — ${photo.place.name}`
        : "Emily — Photo",
    description: photo.alt ?? undefined,
  };
}

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [photo, settings] = await Promise.all([
    client.fetch<PhotoDetail | null>(photoByIdQuery, { id }).catch(() => null),
    client.fetch(settingsQuery).catch(() => null),
  ]);

  if (!photo) notFound();

  const placeId = photo.place?._id;
  const morePhotosAtPlaceRaw = placeId
    ? await client
        .fetch<(RelatedPhoto | null)[]>(morePhotosAtPlaceQuery, {
          placeId,
          excludePhotoId: photo._id,
        })
        .catch(() => [])
    : [];
  // Drop nulls — drafts or broken refs deref to null on the public CDN.
  const morePhotosAtPlace = morePhotosAtPlaceRaw.filter(
    (p): p is RelatedPhoto => !!p?.image,
  );

  const fullSrc = urlFor(photo.image).width(2000).auto("format").url();
  const siblings = (photo.shoot?.siblings ?? []).filter(
    (s): s is { _id: string; image: object; alt?: string } =>
      !!s?.image && s._id !== photo._id,
  );
  const name = settings?.name ?? "Emily";

  return (
    <>
      <Nav name={name} />
      <main className="pt-[72px]">
        <div className="px-7 py-8 max-w-6xl mx-auto">
          <BackLinks photo={photo} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 mt-6">
            <div className="relative w-full bg-surface">
              <Image
                src={fullSrc}
                alt={photo.alt ?? photo.shoot?.title ?? "Photograph"}
                width={1600}
                height={2000}
                priority
                className="w-full h-auto object-contain max-h-[85vh]"
              />
            </div>

            <aside className="space-y-7 lg:sticky lg:top-24 self-start">
              {photo.place && (
                <section>
                  <span className="kicker text-ember mb-2 block">Place</span>
                  <Link
                    href={`/gallery?place=${photo.place.slug}`}
                    className="font-serif text-ink text-2xl leading-tight hover:text-ember transition-colors"
                  >
                    {photo.place.name}
                  </Link>
                </section>
              )}

              {photo.shoot && (
                <section>
                  <span className="kicker text-ink-faint mb-2 block">Shoot</span>
                  <Link
                    href={`/shoots/${photo.shoot.slug}`}
                    className="font-serif text-ink text-xl leading-tight hover:text-ember transition-colors"
                  >
                    {photo.shoot.title}
                  </Link>
                  {photo.shoot.date && (
                    <div className="kicker text-ink-faint mt-1">
                      {photo.shoot.date}
                    </div>
                  )}
                </section>
              )}

              {photo.alt && (
                <section>
                  <span className="kicker text-ink-faint mb-2 block">Caption</span>
                  <p className="text-ink-dim text-sm leading-relaxed font-light">
                    {photo.alt}
                  </p>
                </section>
              )}

              {(photo.tags?.length || photo.shoot?.tags?.length) && (
                <section>
                  <span className="kicker text-ink-faint mb-2 block">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {[...(photo.tags ?? []), ...(photo.shoot?.tags ?? [])]
                      .filter((t, i, arr) => arr.indexOf(t) === i)
                      .map((t) => (
                        <Link
                          key={t}
                          href={`/gallery?tag=${encodeURIComponent(t)}`}
                          className="px-2.5 py-0.5 text-[10px] tracking-wide uppercase border border-rule text-ink-dim hover:border-ember hover:text-ember transition-colors"
                        >
                          {t}
                        </Link>
                      ))}
                  </div>
                </section>
              )}

              {photo.shoot?.wardrobe &&
                (photo.shoot.wardrobe.notes ||
                  photo.shoot.wardrobe.colors?.length ||
                  photo.shoot.wardrobe.items?.length) && (
                  <section>
                    <span className="kicker text-ink-faint mb-2 block">
                      Wardrobe
                    </span>
                    {photo.shoot.wardrobe.notes && (
                      <p className="text-ink-dim text-sm leading-relaxed font-light mb-3">
                        {photo.shoot.wardrobe.notes}
                      </p>
                    )}
                    {photo.shoot.wardrobe.items?.length ? (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {photo.shoot.wardrobe.items.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-0.5 text-[10px] tracking-wide uppercase border border-rule text-ink-dim"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {photo.shoot.wardrobe.colors?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {photo.shoot.wardrobe.colors.map((color) => (
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
            </aside>
          </div>

          {siblings.length > 0 && (
            <section className="mt-16">
              <h2 className="kicker text-ink-faint mb-4">
                More from this shoot
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {siblings.map((s) => {
                  const src = urlFor(s.image)
                    .width(400)
                    .height(500)
                    .fit("crop")
                    .auto("format")
                    .url();
                  return (
                    <Link
                      key={s._id}
                      href={`/photos/${s._id}`}
                      className="relative aspect-[4/5] overflow-hidden bg-surface block group"
                    >
                      <Image
                        src={src}
                        alt={s.alt ?? ""}
                        fill
                        sizes="(max-width: 768px) 33vw, 20vw"
                        className="object-cover brightness-95 group-hover:brightness-100 transition-all duration-300"
                      />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {morePhotosAtPlace.length > 0 && (
            <section className="mt-16">
              <h2 className="kicker text-ink-faint mb-4">
                More from {photo.place?.name}
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {morePhotosAtPlace.map((s) => {
                  const src = urlFor(s.image)
                    .width(400)
                    .height(500)
                    .fit("crop")
                    .auto("format")
                    .url();
                  return (
                    <Link
                      key={s._id}
                      href={`/photos/${s._id}`}
                      className="relative aspect-[4/5] overflow-hidden bg-surface block group"
                    >
                      <Image
                        src={src}
                        alt={s.alt ?? ""}
                        fill
                        sizes="(max-width: 768px) 33vw, 20vw"
                        className="object-cover brightness-95 group-hover:brightness-100 transition-all duration-300"
                      />
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

function BackLinks({ photo }: { photo: PhotoDetail }) {
  return (
    <div className="kicker text-ink-faint flex flex-wrap gap-x-3 gap-y-1">
      <Link href="/gallery" className="hover:text-ember transition-colors">
        ← Gallery
      </Link>
      {photo.place && (
        <>
          <span>·</span>
          <Link
            href={`/gallery?place=${photo.place.slug}`}
            className="hover:text-ember transition-colors"
          >
            {photo.place.name}
          </Link>
        </>
      )}
      {photo.shoot && (
        <>
          <span>·</span>
          <Link
            href={`/shoots/${photo.shoot.slug}`}
            className="hover:text-ember transition-colors"
          >
            {photo.shoot.title}
          </Link>
        </>
      )}
    </div>
  );
}
