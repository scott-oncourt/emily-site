import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";

type Settings = {
  name: string;
  bio: object[];
  aboutPhoto?: object;
};

const defaultBio = [
  "Emily is a Cambodian woman who moves between two worlds — the ancient temples of her homeland and the modern pulse of a country finding its future. Raised near the sacred ground of Bakong, the first great pyramid-temple of the Khmer empire, she carries something in her spirit that the stones have held for a thousand years.",
  "She wears contemporary fashion the way the Apsara wear stone — naturally, as if it were always hers. Whether she is walking the tree-lined avenues of Angkor or navigating the streets of Siem Reap, she is unmistakably, completely herself.",
  "Through photography, video, and her own voice, Emily shares the Cambodia that most visitors never see — not just the monuments, but the warmth, the laughter, and the living culture that has endured everything.",
];

export function About({ settings }: { settings: Settings }) {
  const photoUrl = settings.aboutPhoto
    ? urlFor(settings.aboutPhoto).width(720).height(960).fit("crop").auto("format").url()
    : null;

  return (
    <section id="about" className="px-7 py-20 max-w-5xl mx-auto">
      {/* Pull quote */}
      <p
        className="font-serif font-light text-ink mb-14"
        style={{ fontSize: "clamp(28px, 6vw, 46px)", lineHeight: 1.25 }}
      >
        Born of <em className="italic text-ember">ancient ground.</em>
        <br />
        Living in the present.
        <br />
        Unmistakably Khmer.
      </p>

      {/* Body */}
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {photoUrl && (
          <div className="w-full md:w-72 flex-shrink-0">
            <Image
              src={photoUrl}
              alt={`${settings.name} portrait`}
              width={360}
              height={480}
              className="w-full object-cover object-top"
            />
          </div>
        )}

        <div>
          <span className="kicker text-ember mb-5 block">
            About {settings.name}
          </span>

          {settings.bio?.length ? (
            <div className="text-[15px] text-ink-dim leading-relaxed font-light space-y-4">
              <PortableText value={settings.bio} />
            </div>
          ) : (
            <div className="text-[15px] text-ink-dim leading-relaxed font-light space-y-4">
              {defaultBio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
