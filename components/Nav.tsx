"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { id: "about", href: "/#about", label: "ABOUT" },
  { id: "gallery", href: "/gallery", label: "GALLERY" },
  { id: "map", href: "/map", label: "MAP" },
  { id: "connect", href: "/#connect", label: "CONNECT" },
];

export function Nav({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-7 py-5 transition-all duration-300 ${
          scrolled || menuOpen ? "bg-paper/95 backdrop-blur-sm" : ""
        }`}
        style={{
          background:
            scrolled || menuOpen
              ? undefined
              : "linear-gradient(to bottom, rgb(var(--paper) / 0.85) 0%, transparent 100%)",
        }}
      >
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="font-serif text-xl font-light tracking-widest text-ink hover:text-ember transition-colors relative z-10"
        >
          {name}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 list-none">
            {LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="text-[11px] tracking-widest uppercase text-ink-dim hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center relative z-10">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="p-2 -m-2 text-ink hover:text-ember transition-colors"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="9" x2="20" y2="9" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
        className={`md:hidden fixed inset-0 z-40 bg-paper transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-svh px-7">
          <ul className="flex flex-col items-center gap-7 list-none">
            {LINKS.map((link, i) => (
              <li
                key={link.id}
                className={`transition-all duration-500 ${
                  menuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : "0ms" }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-ink hover:text-ember text-5xl tracking-wide transition-colors"
                >
                  {link.label.charAt(0) +
                    link.label.slice(1).toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
