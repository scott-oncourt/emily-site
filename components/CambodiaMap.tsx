"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type {
  Map as LeafletMap,
  Marker as LeafletMarker,
  TileLayer as LeafletTileLayer,
} from "leaflet";

const TILE_URLS = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
} as const;

export type PlaceLite = {
  _id: string;
  name: string;
  location: { lat: number; lng: number };
  kind: "visit" | "project" | "both";
  blurb?: string;
};

const PIN_COLORS_DARK: Record<PlaceLite["kind"], string> = {
  visit: "#E8843E",   // saffron
  project: "#EDDFC3", // bone
  both: "#F0A363",    // light saffron
};

const PIN_COLORS_LIGHT: Record<PlaceLite["kind"], string> = {
  visit: "#B45A2C",   // terracotta
  project: "#2A1B0E", // deep umber
  both: "#D27246",    // light terracotta
};

function pinSvg(color: string, active: boolean) {
  const stroke = active ? 1.6 : 1.2;
  const dot = active ? 4 : 3.2;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 22 30" fill="none">
      <path d="M11 29 C 11 22, 21 18, 21 11 A 10 10 0 1 0 1 11 C 1 18, 11 22, 11 29 Z"
        fill="${color}" stroke="#141210" stroke-width="${stroke}" />
      <circle cx="11" cy="11" r="${dot}" fill="#141210" />
      ${active ? `<circle cx="11" cy="11" r="1.6" fill="${color}" />` : ""}
    </svg>
  `;
}

export function CambodiaMap({
  places,
  selectedId,
  onSelect,
  className,
}: {
  places: PlaceLite[];
  selectedId?: string | null;
  onSelect?: (place: PlaceLite) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tileLayerRef = useRef<LeafletTileLayer | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const placesRef = useRef(places);
  placesRef.current = places;
  const fittedKeyRef = useRef<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const placesKey = places.map((p) => p._id).join("|");
  const { resolvedTheme } = useTheme();
  const themeKey = resolvedTheme === "light" ? "light" : "dark";

  const validPlaces = places.filter(
    (p) => p.location?.lat != null && p.location?.lng != null,
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      // Initial view: compute centroid + zoom from places so we never flash
      // the whole-Cambodia default before fitting.
      let initialCenter: [number, number] = [12.7, 104.5];
      let initialZoom = 7;
      if (validPlaces.length === 1) {
        const loc = validPlaces[0].location;
        initialCenter = [loc.lat, loc.lng];
        initialZoom = 12;
      } else if (validPlaces.length > 1) {
        const lats = validPlaces.map((p) => p.location.lat);
        const lngs = validPlaces.map((p) => p.location.lng);
        initialCenter = [
          (Math.min(...lats) + Math.max(...lats)) / 2,
          (Math.min(...lngs) + Math.max(...lngs)) / 2,
        ];
        initialZoom = 10;
      }

      const map = L.map(containerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        scrollWheelZoom: true,
        zoomControl: true,
      });
      mapRef.current = map;

      tileLayerRef.current = L.tileLayer(TILE_URLS[themeKey], {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Tighten to bounds for >1 places (single already framed by setView above).
      if (validPlaces.length > 1) {
        const bounds = L.latLngBounds(
          validPlaces.map(
            (p) => [p.location.lat, p.location.lng] as [number, number],
          ),
        );
        map.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 13,
          animate: false,
        });
      }
      fittedKeyRef.current = placesKey;

      setTimeout(() => map.invalidateSize(), 100);
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      markersRef.current = {};
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    tileLayerRef.current?.setUrl(TILE_URLS[themeKey]);
  }, [themeKey, mapReady]);

  // Re-fit bounds when the set of places changes after initial mount
  // (e.g. ISR revalidate brings in a new pin). Skips if already fitted for
  // this exact set, so manual user pan/zoom is preserved otherwise.
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (fittedKeyRef.current === placesKey) return;

    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;
      const live = placesRef.current.filter(
        (p) => p.location?.lat != null && p.location?.lng != null,
      );
      if (live.length === 0) {
        fittedKeyRef.current = placesKey;
        return;
      }
      if (live.length === 1) {
        mapRef.current.setView(
          [live[0].location.lat, live[0].location.lng],
          12,
        );
      } else {
        const bounds = L.latLngBounds(
          live.map(
            (p) => [p.location.lat, p.location.lng] as [number, number],
          ),
        );
        mapRef.current.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 13,
        });
      }
      fittedKeyRef.current = placesKey;
    })();

    return () => {
      cancelled = true;
    };
  }, [placesKey, mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    let cancelled = false;
    (async () => {
      if (!mapRef.current) return;
      const L = (await import("leaflet")).default;
      if (cancelled) return;

      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      const pinColors = themeKey === "light" ? PIN_COLORS_LIGHT : PIN_COLORS_DARK;
      placesRef.current.forEach((place) => {
        if (!place.location) return;
        const isActive = place._id === selectedId;
        const size: [number, number] = isActive ? [28, 38] : [22, 30];
        const anchor: [number, number] = isActive ? [14, 37] : [11, 29];
        const icon = L.divIcon({
          className: "emily-pin",
          html: pinSvg(pinColors[place.kind] ?? pinColors.visit, isActive),
          iconSize: size,
          iconAnchor: anchor,
        });
        const marker = L.marker([place.location.lat, place.location.lng], { icon })
          .addTo(mapRef.current!)
          .on("click", () => onSelectRef.current?.(place));
        markersRef.current[place._id] = marker;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [placesKey, selectedId, mapReady, themeKey]);

  useEffect(() => {
    if (!mapReady || !selectedId || !mapRef.current) return;
    const place = placesRef.current.find((p) => p._id === selectedId);
    if (!place?.location) return;
    const targetZoom = Math.max(mapRef.current.getZoom(), 10);
    mapRef.current.flyTo([place.location.lat, place.location.lng], targetZoom, {
      duration: 0.8,
    });
  }, [selectedId, mapReady]);

  return (
    <div
      ref={containerRef}
      className={className ?? "w-full h-full"}
      role="region"
      aria-label="Map of Cambodia"
    />
  );
}
