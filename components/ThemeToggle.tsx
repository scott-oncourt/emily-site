"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Theme toggle with visible label.
 *
 * UX rules followed:
 *  - Icon + text both reflect the *current* mode (not the action).
 *    Users interpret the click as "toggle"; the visible state matches what
 *    they're currently looking at, which avoids "what does this do?" confusion.
 *  - aria-label describes the *action* ("Switch to dark mode") — what a
 *    screen-reader user needs to predict the outcome.
 *  - aria-pressed gives toggle semantics for assistive tech.
 *  - Mounted gate prevents hydration mismatch (resolvedTheme is null on SSR).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light";
  const next = isLight ? "dark" : "light";
  const currentLabel = !mounted ? "Theme" : isLight ? "Light mode" : "Dark mode";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={mounted ? `Switch to ${next} mode` : "Theme toggle"}
      onClick={() => setTheme(next)}
      className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-ink-dim hover:text-ember transition-colors group"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isLight ? (
          <>
            <circle cx="12" cy="12" r="4.5" />
            <line x1="12" y1="2.5" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="21.5" />
            <line x1="2.5" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="21.5" y2="12" />
            <line x1="5.2" y1="5.2" x2="6.9" y2="6.9" />
            <line x1="17.1" y1="17.1" x2="18.8" y2="18.8" />
            <line x1="5.2" y1="18.8" x2="6.9" y2="17.1" />
            <line x1="17.1" y1="6.9" x2="18.8" y2="5.2" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
      <span>{currentLabel}</span>
    </button>
  );
}
