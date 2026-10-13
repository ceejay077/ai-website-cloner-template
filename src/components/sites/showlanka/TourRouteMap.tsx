"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

type Stop = { name: string; position: [number, number] };

const ROUTE_COLOR = "#1b78ce";

/**
 * The theme's Leaflet route map: grayscale OpenStreetMap tiles, a pin per
 * stop, and arrowed lines joining the stops in order, back to the start.
 */
export function TourRouteMap({ locations }: { locations: Stop[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    (async () => {
      const L = (await import("leaflet")).default;
      // The decorator plugin adds L.polylineDecorator to the same Leaflet module.
      await import("leaflet-polylinedecorator");
      if (cancelled) return;

      const map = L.map(el).setView([7.8731, 80.7718], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        crossOrigin: true,
        className: "sl-map-tiles",
        attribution: "Map data &copy; <span>Vidura Vishwanath Hemawansa</span>",
      }).addTo(map);

      const icon = L.icon({
        iconUrl: "/sites/showlanka/location-dot-solid.svg",
        iconSize: [28, 28],
        iconAnchor: [19, 28],
        popupAnchor: [0, -28],
      });
      locations.forEach((stop) => L.marker(stop.position, { icon }).addTo(map).bindPopup(stop.name));

      locations.forEach((stop, i) => {
        const next = locations[(i + 1) % locations.length];
        const line = L.polyline([stop.position, next.position], { color: ROUTE_COLOR }).addTo(map);
        L.polylineDecorator(line, {
          patterns: [
            {
              offset: "100%",
              repeat: 0,
              symbol: L.Symbol.arrowHead({ pixelSize: 12, polygon: false, pathOptions: { stroke: true, color: ROUTE_COLOR } }),
            },
          ],
        }).addTo(map);
      });

      destroy = () => map.remove();
    })();

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [locations]);

  return <div id="map" ref={ref} className="sl-tourpost__map" />;
}
