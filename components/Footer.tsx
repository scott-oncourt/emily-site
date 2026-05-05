import { ThemeToggle } from "./ThemeToggle";

export function Footer({ name = "Emily" }: { name?: string }) {
  return (
    <footer className="px-7 py-8 border-t border-rule flex flex-wrap items-center justify-between gap-y-5 gap-x-6">
      <div className="font-serif text-lg font-light tracking-widest text-ink-faint">
        {name}
      </div>

      <ThemeToggle />

      <span className="text-[11px] text-ink-faint tracking-widest uppercase">
        Cambodia · {new Date().getFullYear()}
      </span>
    </footer>
  );
}
