import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type HeroPhoto = {
  image: object;
  alt?: string;
};

type Settings = {
  name: string;
  tagline: string;
};

export function Hero({
  photo,
  settings,
}: {
  photo: HeroPhoto | null;
  settings: Settings;
}) {
  const imgUrl = photo
    ? urlFor(photo.image).width(1600).height(2200).fit("crop").auto("format").url()
    : null;

  return (
    <section className="relative h-svh min-h-[600px] overflow-hidden flex items-end">
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={photo?.alt ?? "Emily — Cambodia"}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}

      {/* Gradient overlay — fades into the theme background at the bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(var(--c-bg) / 0.1) 0%, rgb(var(--c-bg) / 0) 35%, rgb(var(--c-bg) / 0.55) 70%, rgb(var(--c-bg)) 100%)",
        }}
      />

      {/* Text */}
      <div className="relative px-7 pb-14 w-full">
        <h1
          className="font-serif font-light text-ink leading-none"
          style={{ fontSize: "clamp(72px, 18vw, 140px)", letterSpacing: "-0.01em" }}
        >
          {settings.name}
        </h1>
        <p className="kicker text-ember mt-5">{settings.tagline}</p>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-5 right-7 flex items-center gap-2 text-[10px] tracking-kicker uppercase text-ink-faint">
        Scroll
        <span className="block w-px h-10 bg-rule" />
      </div>
    </section>
  );
}
