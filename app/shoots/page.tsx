import { client } from "@/sanity/lib/client";
import { shootsListQuery, settingsQuery } from "@/sanity/lib/queries";
import { Nav } from "@/components/Nav";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export const metadata = {
  title: "Emily — Shoots",
  description: "Every photoshoot, by date.",
};

type Shoot = {
  _id: string;
  title: string;
  slug: string;
  date?: string;
  description?: string;
  tags?: string[];
  coverImage?: { _id: string; image: object; alt?: string } | null;
  legacyPhotoIds?: string[];
  forwardPhotoIds?: string[];
};

type ShootCardData = Shoot & { photoCount: number };

export default async function ShootsPage() {
  const [rawShoots, settings] = await Promise.all([
    client.fetch<Shoot[]>(shootsListQuery).catch(() => []),
    client.fetch(settingsQuery).catch(() => null),
  ]);

  const shoots: ShootCardData[] = rawShoots.map((s) => ({
    ...s,
    photoCount: new Set([
      ...(s.legacyPhotoIds ?? []),
      ...(s.forwardPhotoIds ?? []),
    ]).size,
  }));

  const name = settings?.name ?? "Emily";

  return (
    <>
      <Nav name={name} />
      <main className="pt-[72px] px-7 pb-20">
        <div className="max-w-6xl mx-auto">
          <header className="pt-12 pb-10">
            <span className="kicker text-ember mb-3 block">Photography</span>
            <h1 className="font-serif font-light text-ink text-5xl">
              <em className="italic">Shoots</em>
            </h1>
            <p className="text-ink-dim text-sm mt-3 max-w-lg font-light">
              Each session — a day of photographs, sometimes one place,
              sometimes several.
            </p>
          </header>

          {shoots.length === 0 ? (
            <div className="py-20 text-center text-ink-dim">
              <p className="font-serif text-xl mb-2 text-ink">No shoots yet.</p>
              <p className="text-sm">
                Create one in <span className="text-ember">/studio → Shoots</span>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shoots.map((shoot) => (
                <ShootCard key={shoot._id} shoot={shoot} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function ShootCard({ shoot }: { shoot: ShootCardData }) {
  const cover = shoot.coverImage
    ? urlFor(shoot.coverImage.image)
        .width(800)
        .height(1000)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const meta = [
    shoot.date,
    shoot.photoCount &&
      `${shoot.photoCount} ${shoot.photoCount === 1 ? "photo" : "photos"}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link href={`/shoots/${shoot.slug}`} className="block group">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface mb-3">
        {cover ? (
          <Image
            src={cover}
            alt={shoot.coverImage?.alt ?? shoot.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover brightness-95 group-hover:brightness-100 transition-all duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-faint font-serif">
            No cover
          </div>
        )}
      </div>
      <h2 className="font-serif text-ink text-xl group-hover:text-ember transition-colors">
        {shoot.title}
      </h2>
      <div className="kicker text-ink-faint mt-1">{meta}</div>
    </Link>
  );
}
