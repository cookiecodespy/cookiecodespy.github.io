import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { categories, type Report } from "../supabase/functions/_shared/domain";
export default function CityMap({
  reports = [],
  selected,
  onSelect,
  onLocation,
  location,
  center,
}: {
  reports?: Report[];
  selected?: string;
  onSelect?: (id: string) => void;
  onLocation?: (lat: number, lng: number) => void;
  location?: [number, number];
  center?: [number, number];
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const group = useRef<L.MarkerClusterGroup | null>(null);
  const pin = useRef<L.Marker | null>(null);
  const choose = useRef(onLocation);
  const select = useRef(onSelect);
  choose.current = onLocation;
  select.current = onSelect;
  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, {
      center: [-33.444, -70.627],
      zoom: 13,
      zoomControl: false,
    });
    map.current = m;
    L.tileLayer(
      import.meta.env.VITE_MAP_TILE_URL ||
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          import.meta.env.VITE_MAP_ATTRIBUTION ||
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      },
    ).addTo(m);
    L.control.zoom({ position: "bottomright" }).addTo(m);
    group.current = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 48,
    }).addTo(m);
    m.on("click", (e) => choose.current?.(e.latlng.lat, e.latlng.lng));
    const observer = new ResizeObserver(() => m.invalidateSize());
    observer.observe(el.current);
    return () => {
      observer.disconnect();
      m.remove();
      map.current = null;
    };
  }, []);
  useEffect(() => {
    group.current?.clearLayers();
    reports.forEach((r) => {
      const c = categories.find((x) => x.id === r.category)!;
      const icon = L.divIcon({
        className: "incident-marker",
        html: `<span style="--marker-color:${c.color}" ${r.id === selected ? 'class="chosen"' : ""}>${categories.indexOf(c) + 1}</span>`,
        iconSize: [34, 42],
        iconAnchor: [17, 42],
      });
      L.marker([r.latitude, r.longitude], {
        icon,
        title: r.title,
        alt: r.title,
        keyboard: true,
      })
        .on("click", () => select.current?.(r.id))
        .addTo(group.current!);
    });
  }, [reports, selected]);
  useEffect(() => {
    pin.current?.remove();
    if (location && map.current) {
      pin.current = L.marker(location, {
        draggable: !!choose.current,
        title: "Punto elegido: arrastra para ajustar",
        alt: "Punto elegido: arrastra para ajustar",
        icon: L.divIcon({
          className: "location-marker",
          html: "<span></span>",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      })
        .on("dragend", (e) => {
          const p = e.target.getLatLng();
          choose.current?.(p.lat, p.lng);
        })
        .addTo(map.current);
    }
  }, [location]);
  useEffect(() => {
    if (center)
      map.current?.setView(center, 15, {
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
  }, [center]);
  return (
    <div
      ref={el}
      className={`city-map ${onLocation ? "location-picker" : ""}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onLocation && map.current) {
          const p = map.current.getCenter();
          onLocation(p.lat, p.lng);
        }
      }}
      role="region"
      aria-label={
        onLocation
          ? "Mapa para elegir la ubicación del problema"
          : "Mapa de reportes de Santiago"
      }
    />
  );
}
