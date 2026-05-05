import { client } from "@/sanity/lib/client";
import {
  heroQuery,
  galleryQuery,
  kingdomPhotoQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Cambodia } from "@/components/Cambodia";
import { Connect } from "@/components/Connect";

export const revalidate = 60; // ISR — revalidate every 60 seconds

const defaultSettings = {
  name: "Emily",
  tagline: "Ancient grace · Modern world · Pure Cambodia",
  bio: [],
  instagram: "kasal_ellie",
  tiktok: "moly.004",
  facebook: "https://www.facebook.com/moon.ana.631611",
};

export default async function Home() {
  const [heroPhoto, galleryPhotos, kingdomPhoto, rawSettings] = await Promise.all([
    client.fetch(heroQuery).catch(() => null),
    client.fetch(galleryQuery).catch(() => []),
    client.fetch(kingdomPhotoQuery).catch(() => null),
    client.fetch(settingsQuery).catch(() => null),
  ]);

  const settings = rawSettings ?? defaultSettings;

  // Cambodia section: prefer the photo flagged kingdomImage, fall back to
  // the first featured gallery photo if no flag is set yet.
  const cambodiaPhoto = kingdomPhoto ?? galleryPhotos?.[0] ?? null;

  return (
    <>
      <Nav name={settings.name} />

      <main>
        <Hero photo={heroPhoto} settings={settings} />

        <About settings={settings} />

        <Gallery photos={galleryPhotos ?? []} />

        <Cambodia photo={cambodiaPhoto} />

        <Connect settings={settings} />
      </main>
    </>
  );
}
