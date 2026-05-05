import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type Photo = {
  image: object;
  alt?: string;
};

export function Cambodia({ photo }: { photo: Photo | null }) {
  const bgUrl = photo
    ? urlFor(photo.image).width(1600).height(1200).fit("crop").auto("format").url()
    : null;

  return (
    <section
      id="cambodia"
      className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#0d0a06]"
    >
      {bgUrl ? (
        <Image
          src={bgUrl}
          alt={photo?.alt ?? "Cambodia — Angkor"}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}

      {/* Dark vignette — keeps the text-on-photo legible regardless of theme. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, rgba(13,10,6,0.92) 0%, rgba(13,10,6,0.78) 35%, rgba(13,10,6,0.45) 70%, rgba(13,10,6,0.25) 100%)",
        }}
      />

      <div className="relative px-7 py-20 max-w-2xl">
        <span className="kicker text-ember-dim mb-5 block">Cambodia</span>
        <h2 className="font-serif font-light text-bone mb-6 text-balance"
          style={{ fontSize: "clamp(36px, 8vw, 64px)", lineHeight: 1.1 }}
        >
          The kingdom
          <br />
          <em className="not-italic">she calls </em>
          <em className="font-light">home</em>
        </h2>
        <div className="text-[15px] text-bone-dim leading-relaxed font-light space-y-4 max-w-lg">
          <p>
            Cambodia is one of the world&apos;s great undiscovered destinations —
            a civilisation that built the largest religious monument in human
            history, then quietly endured centuries of hardship without losing
            its grace.
          </p>
          <p>
            Emily grew up among temples. She knows the light at dawn over
            Angkor, the faces carved into the stones at Angkor Thom, the silence
            inside Chau Sey Tevoda. She knows which roads lead to places no
            guidebook mentions.
          </p>
          <p className="text-bone">Follow her to see it through Khmer eyes.</p>
        </div>
      </div>
    </section>
  );
}
