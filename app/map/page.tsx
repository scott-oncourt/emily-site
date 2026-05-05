import { client } from "@/sanity/lib/client";
import {
  placesQuery,
  shootsForMapQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import { Nav } from "@/components/Nav";
import { MapClient, type Place } from "@/components/MapClient";

export const revalidate = 60;

export const metadata = {
  title: "Emily — Map",
  description:
    "Cambodia through Emily's eyes — the temples, towns, and projects she recommends.",
};

type PlacePhoto = { _id: string; image: object; alt?: string; location?: string; dateTaken?: string };
type PlaceFromQuery = Omit<Place, "shoots" | "photos"> & {
  photoIds?: string[];
  legacyPhotos?: (PlacePhoto | null)[];
  forwardPhotos?: (PlacePhoto | null)[];
};
type ShootForMap = {
  _id: string;
  title: string;
  slug: string;
  date?: string;
  coverImage?: { _id: string; image: object; alt?: string } | null;
  legacyPhotoIds?: string[];
  forwardPhotoIds?: string[];
};

function unionById<T extends { _id: string }>(...arrs: (T | null | undefined)[][]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const arr of arrs) {
    for (const item of arr ?? []) {
      if (!item || seen.has(item._id)) continue;
      seen.add(item._id);
      out.push(item);
    }
  }
  return out;
}

export default async function MapPage() {
  const [rawPlaces, rawShoots, rawSettings] = await Promise.all([
    client.fetch<PlaceFromQuery[]>(placesQuery).catch(() => []),
    client.fetch<ShootForMap[]>(shootsForMapQuery).catch(() => []),
    client.fetch(settingsQuery).catch(() => null),
  ]);

  // Union forward + legacy photo IDs per shoot.
  const shoots = rawShoots.map((s) => ({
    ...s,
    photoIds: [
      ...new Set([...(s.legacyPhotoIds ?? []), ...(s.forwardPhotoIds ?? [])]),
    ],
    photoCount: new Set([
      ...(s.legacyPhotoIds ?? []),
      ...(s.forwardPhotoIds ?? []),
    ]).size,
  }));

  // Union forward + legacy photos per place; intersect shoots → places by photo refs.
  const places: Place[] = rawPlaces.map((p) => {
    const livePhotos = unionById(
      (p.legacyPhotos ?? []).filter((ph): ph is PlacePhoto => !!ph?.image),
      (p.forwardPhotos ?? []).filter((ph): ph is PlacePhoto => !!ph?.image),
    );
    const placePhotoIds = new Set(livePhotos.map((ph) => ph._id));
    const placeShoots = shoots
      .filter((s) => {
        if (!s.coverImage?.image) return false;
        return s.photoIds.some((id) => placePhotoIds.has(id));
      })
      .map(({ photoIds: _ids, legacyPhotoIds: _l, forwardPhotoIds: _f, ...rest }) => rest);
    return { ...p, photos: livePhotos, shoots: placeShoots };
  });

  const name = rawSettings?.name ?? "Emily";

  return (
    <>
      <Nav name={name} />
      <main className="pt-[72px]">
        {places.length === 0 ? (
          <div className="h-[calc(100svh-72px)] flex flex-col items-center justify-center px-7 text-center gap-4">
            <span className="kicker text-ember">Map</span>
            <p className="font-serif text-2xl text-ink">No places yet.</p>
            <p className="text-sm text-ink-dim max-w-sm">
              Add places in <span className="text-ember">/studio → Places</span>{" "}
              with a name and a location pin to populate the map.
            </p>
          </div>
        ) : (
          <MapClient places={places} />
        )}
      </main>
    </>
  );
}
