import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Camera,
  Upload,
  LocateFixed,
  MapPin,
  Check,
  CheckCircle2,
  ArrowRight,
  X,
  Droplets,
  Route,
  TriangleAlert,
  Trees,
  TrafficCone,
  Lightbulb,
  Building2,
} from "lucide-react";
import {
  categories,
  communes,
  validateReport,
  type ReportInput,
} from "../supabase/functions/_shared/domain";
import {
  canSubmit,
  requiresTurnstile,
  preparePhoto,
  submitReport,
} from "./api";
import CityMap from "./Map";
import Turnstile from "./Turnstile";

const icons = {
  water: Droplets,
  road: Route,
  signal: TriangleAlert,
  tree: Trees,
  block: TrafficCone,
  light: Lightbulb,
  building: Building2,
  pin: MapPin,
};
const shortNames = [
  "Inundación",
  "Bache",
  "Semáforo",
  "Árbol caído",
  "Calle bloqueada",
  "Alumbrado",
  "Infraestructura",
  "Otro",
];
export default function ReportComposer({ onDone }: { onDone: () => void }) {
  const [point, setPoint] = useState<[number, number]>();
  const [showMap, setShowMap] = useState(false);
  const [commune, setCommune] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [consent, setConsent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [gpsBusy, setGpsBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [token, setToken] = useState("");
  const [widget, setWidget] = useState(0);
  const lock = useRef(false);
  const requestId = useRef(crypto.randomUUID());
  const camera = useRef<HTMLInputElement>(null),
    gallery = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);
  function locate(lat: number, lng: number) {
    if (lat < -33.6 || lat > -33.3 || lng < -70.85 || lng > -70.45) {
      setError(
        "Ese punto está fuera del área del piloto. Elige el lugar en el mapa.",
      );
      return;
    }
    setPoint([lat, lng]);
    setError("");
  }
  function gps() {
    setShowMap(true);
    setError("");
    if (!navigator.geolocation) {
      setError(
        "Tu navegador no permite ubicación. Toca el mapa para elegirla.",
      );
      return;
    }
    setGpsBusy(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        locate(p.coords.latitude, p.coords.longitude);
        setGpsBusy(false);
      },
      () => {
        setError(
          "No pudimos acceder a tu ubicación. Toca el mapa para elegirla manualmente.",
        );
        setGpsBusy(false);
      },
      { timeout: 10000, maximumAge: 30000 },
    );
  }
  async function upload(selected: File[]) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      if (files.length + selected.length > 3)
        throw new Error("Puedes adjuntar hasta tres fotografías.");
      const prepared: File[] = [];
      for (const f of selected) prepared.push(await preparePhoto(f));
      setFiles((prev) => [...prev, ...prepared]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos preparar la foto.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (lock.current) return;
    setError("");
    try {
      if (!point) throw new Error("Primero elige dónde está pasando.");
      const data: ReportInput = validateReport({
        description,
        category,
        commune,
        latitude: point[0],
        longitude: point[1],
        consent,
      });
      if (!canSubmit)
        throw new Error("El envío se habilitará al conectar el servicio.");
      if (requiresTurnstile && !token)
        throw new Error("Completa la verificación de seguridad.");
      lock.current = true;
      setBusy(true);
      const result = await submitReport(data, files, token, requestId.current);
      setReference(result.reference);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No pudimos enviar. Conservamos tus datos para reintentar.",
      );
      setToken("");
      setWidget((n) => n + 1);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  if (reference)
    return (
      <div className="success">
        <CheckCircle2 size={52} />
        <h3>Gracias por ayudar a tu comuna.</h3>
        <p>Recibimos tu reporte. El equipo lo revisará antes de publicarlo.</p>
        <span className="reference">{reference}</span>
        <p className="small">
          Guarda tu referencia. El envío no notifica automáticamente a
          autoridades.
        </p>
        <button className="primary" onClick={onDone}>
          Volver al mapa <ArrowRight size={18} />
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="report-form quick-report">
      <p className="composer-intro">
        Un punto, una foto si quieres y lo que viste. Así de simple.
      </p>
      {!canSubmit && (
        <div className="notice">
          Puedes explorar el formulario. Los envíos estarán disponibles cuando
          conectemos el servicio.
        </div>
      )}
      <section className="composer-section">
        <h3>
          <span>1</span> ¿Dónde está pasando?
        </h3>
        <div className="capture-actions">
          <button
            type="button"
            className="primary"
            onClick={gps}
            disabled={gpsBusy || busy}
          >
            <LocateFixed size={20} />
            {gpsBusy ? "Buscando ubicación…" : "Usar mi ubicación"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => setShowMap(true)}
          >
            <MapPin size={20} />
            Marcar en el mapa
          </button>
        </div>
        {showMap && (
          <>
            <div className="picker-wrap">
              <CityMap onLocation={locate} location={point} center={point} />
            </div>
            <p className="field-hint">
              Toca el lugar o arrastra el pin. Con teclado, mueve el mapa con
              las flechas y pulsa Enter para elegir su centro.
            </p>
          </>
        )}
        <p
          className={`location-summary ${point ? "chosen" : ""}`}
          role="status"
        >
          {point ? (
            <>
              <Check size={17} />
              Punto seleccionado{commune ? ` · ${commune}` : ""}. Puedes
              ajustarlo en el mapa.
            </>
          ) : (
            "Todavía no has elegido un lugar."
          )}
        </p>
        <label>
          Comuna del problema
          <select
            aria-label="Comuna del problema"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            required
          >
            <option value="">Elige la comuna</option>
            {communes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </section>
      <section className="composer-section">
        <h3>
          <span>2</span> Muestra lo que ocurre <small>Opcional</small>
        </h3>
        <div className="capture-actions">
          <button
            type="button"
            className="secondary"
            onClick={() => camera.current?.click()}
            disabled={busy || files.length === 3}
          >
            <Camera size={23} />
            Tomar foto
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => gallery.current?.click()}
            disabled={busy || files.length === 3}
          >
            <Upload size={23} />
            Subir foto
          </button>
        </div>
        <input
          ref={camera}
          className="visually-hidden"
          aria-label="Tomar fotografía"
          type="file"
          accept="image/*"
          capture="environment"
          disabled={busy}
          onChange={(e) => {
            void upload(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        <input
          ref={gallery}
          className="visually-hidden"
          aria-label="Adjuntar fotografías"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          disabled={busy}
          onChange={(e) => {
            void upload(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        <p className="field-hint">
          Hasta 3 fotos. También puedes enviar sin foto. Evita rostros, patentes
          y datos personales.
        </p>
        <div className="photo-previews">
          {previews.map((url, i) => (
            <div key={url}>
              <img src={url} alt={`Fotografía adjunta ${i + 1}`} />
              <button
                disabled={busy}
                type="button"
                aria-label={`Quitar fotografía ${i + 1}`}
                onClick={() => setFiles((f) => f.filter((_, j) => j !== i))}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="composer-section">
        <h3>
          <span>3</span> ¿Qué ocurrió?
        </h3>
        <fieldset className="category-fieldset">
          <legend className="visually-hidden">Tipo de problema</legend>
          <div className="category-options">
            {categories.map((c, i) => {
              const Icon = icons[c.icon];
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  className={category === c.id ? "selected" : ""}
                  onClick={() => setCategory(c.id)}
                >
                  <Icon size={21} style={{ color: c.color }} />
                  {shortNames[i]}
                  {category === c.id && <Check size={15} />}
                </button>
              );
            })}
          </div>
        </fieldset>
        <label>
          Cuéntanos brevemente qué pasó
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="La calle está inundada y los autos no pueden pasar…"
            minLength={15}
            maxLength={1500}
            rows={3}
            required
          />
          <span className="field-hint">
            Una frase basta. El título se genera automáticamente.
          </span>
        </label>
      </section>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>
          Es un problema del espacio público y no incluyo datos personales
          sensibles. Será revisado antes de publicarse.
        </span>
      </label>
      <Turnstile key={widget} action="submit" onToken={setToken} />
      {error && (
        <p className="error" role="alert">
          {error} Tus datos y fotos siguen aquí.
        </p>
      )}
      <div className="composer-submit">
        <span>Revisión antes de publicación</span>
        <button
          className="primary"
          disabled={busy || !canSubmit || (requiresTurnstile && !token)}
        >
          {busy ? "Preparando o enviando…" : "Enviar reporte"}
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
