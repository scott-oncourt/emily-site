import { client } from "@/sanity/lib/client";
import { galleryFeedQuery, settingsQuery } from "@/sanity/lib/queries";
import { Nav } from "@/components/Nav";
import { GalleryClient, type GalleryFeed } from "@/components/GalleryClient";

export const revalidate = 60;

export const metadata = {
  title: "Emily — Gallery",
  description:
    "Every shoot, every place — filter by location, tag, and more.",
};

export default async function GalleryPage() {
  const [feed, settings] = await Promise.all([
    client.fetch<GalleryFeed>(galleryFeedQuery).catch(() => ({
      photos: [],
      places: [],
      tagsFromShoots: [],
      tagsFromPhotos: [],
      colors: [],
    })),
    client.fetch(settingsQuery).catch(() => null),
  ]);

  const name = settings?.name ?? "Emily";

  return (
    <>
      <Nav name={name} />
      <main className="pt-[72px]">
        {feed.photos.length === 0 ? (
          <div className="h-[calc(100svh-72px)] flex flex-col items-center justify-center px-7 text-center gap-4">
            <span className="kicker text-ember">Gallery</span>
            <p className="font-serif text-2xl text-ink">No photos yet.</p>
            <p className="text-sm text-ink-dim max-w-sm">
              Upload photos in <span className="text-ember">/studio → Photos</span>{" "}
              and group them into Shoots to see them here.
            </p>
          </div>
        ) : (
          <GalleryClient feed={feed} />
        )}
      </main>
    </>
  );
}
