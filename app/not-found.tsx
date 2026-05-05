import Link from "next/link";

export const metadata = {
  title: "Emily — Lost in the temple",
};

export default function NotFound() {
  return (
    <main className="min-h-svh flex flex-col items-center justify-center px-7 py-20 text-center bg-paper">
      <span className="kicker text-ember">404 · បាត់</span>

      <h1
        className="font-serif font-light text-ink mt-4"
        style={{ fontSize: "clamp(48px, 9vw, 96px)", lineHeight: 1.05 }}
      >
        Lost in the <em className="italic">temple</em>.
      </h1>

      <p className="text-ink-dim text-base font-light mt-6 max-w-md leading-relaxed">
        The page you were looking for has been swallowed by the jungle. The
        stones still stand — try one of the paths below.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <Link
          href="/"
          className="kicker text-ink hover:text-ember transition-colors"
        >
          ← Home
        </Link>
        <span className="text-ink-faint">·</span>
        <Link
          href="/gallery"
          className="kicker text-ink hover:text-ember transition-colors"
        >
          Gallery
        </Link>
        <span className="text-ink-faint">·</span>
        <Link
          href="/map"
          className="kicker text-ink hover:text-ember transition-colors"
        >
          Map
        </Link>
      </div>
    </main>
  );
}
