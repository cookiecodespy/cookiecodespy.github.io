import NewsFeed from "./NewsFeed";
import ReportComposer from "./ReportComposer";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  Droplets,
  Flag,
  Lightbulb,
  List,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Trees,
  TriangleAlert,
  Users,
  X,
  Phone,
  Route,
  Building2,
  TrafficCone,
  CircleHelp,
  LogOut,
  Share2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  categories,
  communes,
  stateLabels,
  isStale,
  type Report,
  type Moderation,
  type IncidentState,
} from "../supabase/functions/_shared/domain";
import {
  canSubmit,
  configured,
  client,
  listReports,
  getReport,
  mutate,
} from "./api";
import CityMap from "./Map";
import Turnstile from "./Turnstile";

const icons: Record<string, LucideIcon> = {
  water: Droplets,
  road: Route,
  signal: TriangleAlert,
  tree: Trees,
  block: TrafficCone,
  light: Lightbulb,
  building: Building2,
  pin: MapPin,
};
const date = (s: string) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(s));
function age(s: string) {
  const h = Math.max(
    0,
    Math.floor((Date.now() - new Date(s).getTime()) / 3600000),
  );
  return h < 1
    ? "Hace menos de una hora"
    : h < 24
      ? `Hace ${h} h`
      : `Hace ${Math.floor(h / 24)} días`;
}
function errorText(e: unknown) {
  return e instanceof Error
    ? e.message
    : "Ocurrió un problema. Inténtalo nuevamente.";
}
function Logo() {
  return (
    <a href="/pulso-santiago/" className="brand" aria-label="Pulso Santiago, inicio">
      <span className="brand-mark">
        <Activity size={25} strokeWidth={2.5} />
      </span>
      <span>
        pulso<span className="brand-city">SANTIAGO</span>
      </span>
    </a>
  );
}
function CategoryIcon({ id, size = 20 }: { id: string; size?: number }) {
  const c = categories.find((c) => c.id === id)!;
  const Icon = icons[c.icon];
  return (
    <span
      className="category-icon"
      style={{ color: c.color, background: `${c.color}14` }}
    >
      <Icon size={size} />
    </span>
  );
}
function Status({ report }: { report: Report }) {
  return (
    <span
      className={`status ${report.status === "resolved" ? "resolved" : ""}`}
    >
      {isStale(report) ? "Necesita actualización" : stateLabels[report.status]}
    </span>
  );
}
function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            onClose();
        }
      }}
      aria-labelledby="dialog-title"
    >
      <div className="modal-heading">
        <div>
          <span className="eyebrow">PULSO SANTIAGO</span>
          <h2 id="dialog-title">{title}</h2>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Cerrar">
          <X size={22} />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
function ReportCard({
  r,
  onClick,
  admin = false,
}: {
  r: Report;
  onClick: () => void;
  admin?: boolean;
}) {
  return (
    <button className="report-card" onClick={onClick}>
      <div className="card-top">
        <CategoryIcon id={r.category} />
        <span className="card-location">
          {r.commune} <span>· {age(r.created_at)}</span>
        </span>
        <ChevronRight size={17} />
      </div>
      <h3>{r.title}</h3>
      <p>{r.description}</p>
      <div className="card-bottom">
        <Status report={r} />
        {admin ? (
          <span>{stateLabels[r.moderation]}</span>
        ) : (
          <span>
            <Users size={13} /> {r.confirmations}
          </span>
        )}
      </div>
    </button>
  );
}
function Empty({ filtered = false }: { filtered?: boolean }) {
  return (
    <div className="empty">
      <span className="empty-symbol">
        <MapPin size={28} />
        <span>
          <Check size={12} />
        </span>
      </span>
      <h3>
        {filtered
          ? "No hay reportes con estos filtros"
          : "Tu comuna empieza contigo"}
      </h3>
      <p>
        {filtered
          ? "Prueba otra categoría o amplía la búsqueda."
          : "Los reportes publicados aparecerán aquí. Si ves un problema en la calle, puedes ser quien dé el primer aviso."}
      </p>
    </div>
  );
}

function Detail({
  reportId,
  admin,
  onChanged,
}: {
  reportId: string;
  admin: boolean;
  onChanged: () => Promise<void>;
}) {
  const [r, setR] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [action, setAction] = useState<"confirm" | "flag" | null>(null);
  const [token, setToken] = useState("");
  const [reason, setReason] = useState("");
  const [kind, setKind] = useState("content");
  const [busy, setBusy] = useState(false);
  const [flags, setFlags] = useState<
    { id: string; reason: string; kind: string }[]
  >([]);
  const refresh = useCallback(async () => {
    try {
      const result = await getReport(reportId, admin);
      setR(result.report);
      setFlags(result.flags ?? []);
    } catch (e) {
      setError(errorText(e));
    }
  }, [reportId, admin]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  if (error && !r)
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
  if (!r) return <div className="skeleton" aria-label="Cargando reporte" />;
  async function execute(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await mutate(action === "confirm" ? "/confirm" : "/flag", {
        id: reportId,
        token,
        reason,
        kind,
      });
      setNotice(
        action === "confirm"
          ? result.confirmed
            ? "Gracias. Registramos tu confirmación."
            : "Ya habías confirmado este reporte."
          : "Recibimos tu solicitud para revisión.",
      );
      setAction(null);
      setToken("");
      await refresh();
      await onChanged();
    } catch (e) {
      setError(errorText(e));
      setToken("");
      setAction(null);
    } finally {
      setBusy(false);
    }
  }
  async function share() {
    try {
      const link = `${location.origin}/?report=${reportId}`;
      if (navigator.share)
        await navigator.share({ title: r!.title, url: link });
      else {
        await navigator.clipboard.writeText(link);
        setNotice("Enlace copiado.");
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError"))
        setError(
          "No pudimos compartir el enlace. Puedes copiar la dirección del navegador.",
        );
    }
  }
  return (
    <div className="detail">
      <div className="detail-meta">
        <CategoryIcon id={r.category} />
        <span>
          {categories.find((c) => c.id === r.category)!.label} · {r.commune}
        </span>
        <Status report={r} />
      </div>
      <h3>{r.title}</h3>
      <p className="detail-description">{r.description}</p>
      <div className="detail-photo-grid">
        {r.photos?.map((p) => (
          <a key={p.id} href={p.url} target="_blank" rel="noreferrer">
            <img
              src={p.url}
              alt="Evidencia fotográfica del problema reportado"
            />
          </a>
        ))}
      </div>
      <div className="detail-facts">
        <span>
          <MapPin size={16} />
          {r.commune}
        </span>
        <span>
          <Clock3 size={16} />
          {date(r.created_at)}
        </span>
        <span>
          <Users size={16} />
          {r.confirmations} confirmaciones
        </span>
      </div>
      <div className="evidence-note">
        <ShieldCheck size={18} />
        {r.verified_at
          ? "Verificación documentada en el historial."
          : r.moderation === "approved"
            ? "Publicado tras revisión. El incidente aún no tiene verificación documental."
            : "En revisión administrativa. La publicación no está disponible en el mapa."}
      </div>
      {isStale(r) && (
        <div className="notice">
          Este incidente temporal no se ha actualizado en más de 24 horas.
          Confirma las condiciones antes de viajar.
        </div>
      )}
      <div className="detail-map">
        <CityMap reports={[r]} center={[r.latitude, r.longitude]} />
      </div>
      <h4>Seguimiento del reporte</h4>
      <ol className="timeline">
        {r.events?.map((e) => (
          <li key={e.id}>
            <span className="timeline-dot" />
            <div>
              <b>{stateLabels[e.to_status] ?? e.to_status}</b>
              <p>{e.reason}</p>
              {e.evidence_url && (
                <a href={e.evidence_url} target="_blank" rel="noreferrer">
                  Ver evidencia <ArrowUpRight size={13} />
                </a>
              )}
              <time>{date(e.created_at)}</time>
            </div>
          </li>
        ))}
      </ol>
      {admin ? (
        <ModerationPanel
          r={r}
          onChanged={async () => {
            await refresh();
            await onChanged();
          }}
        />
      ) : (
        <>
          <div className="detail-actions">
            <button
              className="primary"
              disabled={!canSubmit || r.status === "resolved"}
              onClick={() => {
                setAction("confirm");
                setToken("");
              }}
            >
              <Check size={16} />
              Sigue ocurriendo
            </button>
            <button className="secondary" onClick={() => void share()}>
              <Share2 size={16} />
              Compartir
            </button>
            <button
              className="icon-button"
              aria-label="Denunciar contenido o solicitar revisión de privacidad"
              disabled={!canSubmit}
              onClick={() => {
                setAction("flag");
                setToken("");
              }}
            >
              <Flag size={18} />
            </button>
          </div>
          {action && (
            <form className="inline-form" onSubmit={execute}>
              <h4>
                {action === "confirm"
                  ? "Confirma solo si lo viste recientemente"
                  : "Solicitar revisión"}
              </h4>
              {action === "flag" && (
                <>
                  <label>
                    Tipo de solicitud
                    <select
                      value={kind}
                      onChange={(e) => setKind(e.target.value)}
                    >
                      <option value="content">
                        Contenido incorrecto o inapropiado
                      </option>
                      <option value="privacy">
                        Privacidad o eliminación de información
                      </option>
                    </select>
                  </label>
                  <label>
                    Motivo
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      minLength={10}
                      maxLength={1000}
                      required
                    />
                  </label>
                </>
              )}
              <Turnstile action={action} onToken={setToken} />
              <button className="primary" disabled={busy || !token}>
                {busy ? "Enviando…" : "Confirmar envío"}
              </button>
            </form>
          )}
        </>
      )}
      {admin && flags.length > 0 && (
        <div className="flag-list">
          <h4>Solicitudes de revisión ({flags.length})</h4>
          {flags.map((f) => (
            <p key={f.id}>
              <b>{f.kind === "privacy" ? "Privacidad" : "Contenido"}:</b>{" "}
              {f.reason}
            </p>
          ))}
        </div>
      )}
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <p className="small reference-line">
        Referencia {r.reference} · No consta notificación automática a
        autoridades.
      </p>
    </div>
  );
}

function ModerationPanel({
  r,
  onChanged,
}: {
  r: Report;
  onChanged: () => Promise<void>;
}) {
  const [mod, setMod] = useState<Moderation>(r.moderation);
  const [status, setStatus] = useState<IncidentState>(r.status);
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [verify, setVerify] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await mutate("/admin/moderate", {
        id: r.id,
        moderation: mod,
        status,
        reason,
        evidence,
        verify,
      });
      await onChanged();
      setReason("");
      setVerify(false);
      setSuccess("Cambio guardado en el historial.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="moderation-panel" onSubmit={save}>
      <h4>
        <ShieldCheck size={18} />
        Moderación y seguimiento
      </h4>
      <div className="coords">
        <label>
          Publicación
          <select
            value={mod}
            onChange={(e) => setMod(e.target.value as Moderation)}
          >
            {["pending", "approved", "rejected", "hidden"].map((s) => (
              <option key={s} value={s}>
                {stateLabels[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Situación
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as IncidentState)}
          >
            {[
              "reported",
              "tracking",
              "resolved",
              "outdated",
              ...(r.status === "community_confirmed"
                ? ["community_confirmed"]
                : []),
            ].map((s) => (
              <option key={s} value={s}>
                {stateLabels[s]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Motivo del cambio
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Si cambias la situación, este texto aparecerá en el historial público."
          minLength={10}
          maxLength={1000}
          required
        />
      </label>
      <label>
        Evidencia documental (HTTPS)
        <input
          type="url"
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="https://…"
          required={(status === "resolved" && status !== r.status) || verify}
        />
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={verify}
          onChange={(e) => setVerify(e.target.checked)}
        />
        <span>Registrar verificación documental del incidente.</span>
      </label>
      <button className="primary" disabled={busy}>
        {busy ? "Guardando…" : "Guardar cambio"}
      </button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="notice" role="status">
          {success}
        </p>
      )}
    </form>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function login(e: FormEvent) {
    e.preventDefault();
    if (!client) {
      setError(
        "La administración estará disponible cuando conectemos Supabase.",
      );
      return;
    }
    setBusy(true);
    try {
      const { error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (error)
        throw new Error(
          "No pudimos iniciar sesión. Revisa tu correo y contraseña.",
        );
      onLogin();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="login-form" onSubmit={login}>
      <span className="large-icon">
        <ShieldCheck size={28} />
      </span>
      <h2>Administración BlueBox</h2>
      <p>Acceso exclusivo para el equipo de moderación.</p>
      <label>
        Correo
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button className="primary full" disabled={busy || !configured}>
        {busy ? "Ingresando…" : "Iniciar sesión"}
        <ArrowRight size={17} />
      </button>
      {!configured && (
        <p className="notice">El acceso aún no está configurado.</p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export default function App() {
  const admin = location.pathname === "/admin";
  const [panel, setPanel] = useState(
    new URLSearchParams(location.search).get("view") === "news"
      ? "news"
      : "reports",
  );
  function switchPanel(value: string) {
    setPanel(value);
    const url = new URL(location.href);
    if (value === "news") url.searchParams.set("view", "news");
    else url.searchParams.delete("view");
    history.replaceState({}, "", url);
    setMenu(false);
  }

  const [signedIn, setSignedIn] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [commune, setCommune] = useState(() => {
    try {
      const saved = localStorage.getItem("pulso-zone");
      return communes.some((c) => c === saved) ? saved! : "all";
    } catch {
      return "all";
    }
  });
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("all");
  const [view, setView] = useState<"map" | "list">("map");
  const [modal, setModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(
    new URLSearchParams(location.search).get("report"),
  );
  const [center, setCenter] = useState<[number, number] | undefined>();
  const [menu, setMenu] = useState(false);
  const refresh = useCallback(async () => {
    if (!configured || (admin && !signedIn)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await listReports(admin);
      setReports(result.reports);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }, [admin, signedIn]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    if (!client) return;
    client.auth
      .getSession()
      .then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = client.auth.onAuthStateChange((_event, session) =>
      setSignedIn(Boolean(session)),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const pop = () =>
      setSelected(new URLSearchParams(location.search).get("report"));
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  const openDetail = (id: string) => {
    setSelected(id);
    history.pushState({}, "", `${admin ? "/admin" : "/"}?report=${id}`);
  };
  const closeDetail = () => {
    setSelected(null);
    history.replaceState({}, "", admin ? "/admin" : "/");
  };
  const filtered = reports.filter(
    (r) =>
      (category === "all" || r.category === category) &&
      (commune === "all" || r.commune === commune) &&
      (status === "all" ||
        (admin ? r.moderation : r.status) === status ||
        (!admin && status === "outdated" && isStale(r))) &&
      (period === "all" ||
        Date.now() - new Date(r.created_at).getTime() <
          Number(period) * 86400000) &&
      `${r.title} ${r.description} ${r.commune}`
        .toLocaleLowerCase("es")
        .includes(query.toLocaleLowerCase("es")),
  );
  const active = reports.filter((r) => r.status !== "resolved").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;
  function gps() {
    navigator.geolocation?.getCurrentPosition(
      (p) => setCenter([p.coords.latitude, p.coords.longitude]),
      () =>
        setError(
          "No pudimos acceder a tu ubicación. Explora el mapa manualmente.",
        ),
      { timeout: 10000 },
    );
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <header className="header">
        <Logo />
        <nav aria-label="Navegación principal" className={menu ? "open" : ""}>
          <button
            className={panel === "reports" ? "nav-active" : ""}
            onClick={() => switchPanel("reports")}
          >
            Explorar
          </button>
          <button
            className={panel === "news" ? "nav-active" : ""}
            onClick={() => switchPanel("news")}
          >
            Pulso Ahora
          </button>
          <button
            onClick={() => {
              setModal("how");
              setMenu(false);
            }}
          >
            Cómo funciona
          </button>
          <button
            onClick={() => {
              setModal("help");
              setMenu(false);
            }}
          >
            Ayuda y emergencias <ArrowUpRight size={14} />
          </button>
        </nav>
        <div className="header-right">
          <span className="initiative">
            Una iniciativa de{" "}
            <b>
              BlueBox<span>▦</span>
            </b>
          </span>
          <button
            className="primary header-report"
            onClick={() => setModal("report")}
          >
            <Plus size={18} />
            Reportar problema
          </button>
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-label="Abrir menú"
            aria-expanded={menu}
          >
            <Menu size={23} />
          </button>
        </div>
      </header>
      {!configured && (
        <div className="preview-banner" role="status">
          <span>
            <span className="tiny-dot" /> Vista previa del proyecto
          </span>
          Conexión de reportes pendiente. No se muestran incidentes simulados.
        </div>
      )}
      <main id="main">
        {admin && !signedIn ? (
          <div className="login-wrap">
            <Login onLogin={() => setSignedIn(true)} />
          </div>
        ) : (
          <>
            <section className="intro">
              <div>
                <div className="eyebrow">
                  <span className="tiny-dot" />{" "}
                  {admin ? "EQUIPO BLUEBOX" : "JUNTOS, UNA CIUDAD MEJOR"}
                </div>
                <h1>
                  {admin ? (
                    "Cada reporte merece seguimiento."
                  ) : (
                    <>
                      Lo que pasa en tu comuna,
                      <br />
                      <span>a un vistazo.</span>
                    </>
                  )}
                </h1>
                <p>
                  {admin
                    ? "Revisa evidencias, publica reportes y registra cada cambio."
                    : "Conoce los problemas de tu barrio, comparte lo que ves y sigue las soluciones."}
                </p>
              </div>
              <div className="intro-aside">
                {admin ? (
                  <button
                    className="secondary"
                    onClick={() => void client?.auth.signOut()}
                  >
                    <LogOut size={17} />
                    Cerrar sesión
                  </button>
                ) : (
                  <>
                    <span className="community-art">
                      <span>
                        <Trees size={19} />
                      </span>
                      <span>
                        <Droplets size={19} />
                      </span>
                      <span>
                        <MapPin size={19} />
                      </span>
                      <span>
                        <Users size={19} />
                      </span>
                    </span>
                    <b>
                      La ciudad es de todos.
                      <br />
                      La información también.
                    </b>
                    <span>Gratis. Sin suscripciones.</span>
                  </>
                )}
              </div>
            </section>
            {panel === "news" ? (
              <NewsFeed admin={admin} />
            ) : (
              <>
                <section className="explorer" aria-label="Explorar reportes">
                  <div className="filter-bar">
                    <div className="search-field">
                      <Search size={18} />
                      <input
                        aria-label="Buscar reportes o comuna"
                        placeholder="Busca un reporte o comuna"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <label className="commune-select">
                      <MapPin size={17} />
                      <select
                        aria-label="Filtrar por comuna"
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                      >
                        <option value="all">Todas las comunas</option>
                        {communes.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <select
                      className="status-select"
                      aria-label="Filtrar por estado"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="all">Todos los estados</option>
                      {(admin
                        ? ["pending", "approved", "hidden", "rejected"]
                        : [
                            "reported",
                            "community_confirmed",
                            "tracking",
                            "resolved",
                            "outdated",
                          ]
                      ).map((s) => (
                        <option value={s} key={s}>
                          {stateLabels[s]}
                        </option>
                      ))}
                    </select>
                    <select
                      className="period-select"
                      aria-label="Filtrar por fecha"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <option value="all">Cualquier fecha</option>
                      <option value="1">Últimas 24 h</option>
                      <option value="7">Últimos 7 días</option>
                      <option value="30">Últimos 30 días</option>
                    </select>
                    <div className="view-toggle">
                      <button
                        aria-label="Vista de mapa"
                        aria-pressed={view === "map"}
                        className={view === "map" ? "active" : ""}
                        onClick={() => setView("map")}
                      >
                        <MapIcon size={17} />
                        <span>Mapa</span>
                      </button>
                      <button
                        aria-label="Vista de lista"
                        aria-pressed={view === "list"}
                        className={view === "list" ? "active" : ""}
                        onClick={() => setView("list")}
                      >
                        <List size={17} />
                        <span>Lista</span>
                      </button>
                    </div>
                  </div>
                  <div className="category-bar">
                    <button
                      className={category === "all" ? "active" : ""}
                      onClick={() => setCategory("all")}
                      aria-pressed={category === "all"}
                    >
                      <Compass size={16} />
                      Todos
                    </button>
                    {categories.map((c) => {
                      const Icon = icons[c.icon];
                      return (
                        <button
                          className={category === c.id ? "active" : ""}
                          style={
                            {
                              "--category-color": c.color,
                            } as React.CSSProperties
                          }
                          key={c.id}
                          onClick={() => setCategory(c.id)}
                          aria-pressed={category === c.id}
                        >
                          <Icon size={16} />
                          {c.id === "bache"
                            ? "Baches"
                            : c.id === "semaforo"
                              ? "Semáforos"
                              : c.id === "infraestructura"
                                ? "Infraestructura"
                                : c.label}
                        </button>
                      );
                    })}
                  </div>
                  <div
                    className={`explorer-body ${view === "list" ? "list-view" : ""}`}
                  >
                    <aside className="report-sidebar">
                      <div className="sidebar-heading">
                        <div>
                          <span className="eyebrow">
                            {admin
                              ? "BANDEJA DE MODERACIÓN"
                              : "REPORTES DE LA COMUNIDAD"}
                          </span>
                          <h2>
                            {query || category !== "all"
                              ? "Resultados"
                              : "En tu ciudad"}{" "}
                            <span>{filtered.length}</span>
                          </h2>
                        </div>
                        <button
                          className="icon-button"
                          aria-label="Actualizar reportes"
                          onClick={() => void refresh()}
                          disabled={loading}
                        >
                          <ArrowDown size={17} />
                        </button>
                      </div>
                      {loading ? (
                        <>
                          <div className="skeleton" />
                          <div className="skeleton" />
                        </>
                      ) : error ? (
                        <div className="error-panel" role="alert">
                          <TriangleAlert size={24} />
                          <h3>No pudimos cargar los reportes</h3>
                          <p>{error}</p>
                          <button
                            className="secondary"
                            onClick={() => void refresh()}
                          >
                            Reintentar
                          </button>
                        </div>
                      ) : filtered.length ? (
                        filtered.map((r) => (
                          <ReportCard
                            key={r.id}
                            r={r}
                            admin={admin}
                            onClick={() => openDetail(r.id)}
                          />
                        ))
                      ) : (
                        <Empty
                          filtered={
                            query !== "" ||
                            category !== "all" ||
                            commune !== "all" ||
                            status !== "all" ||
                            period !== "all"
                          }
                        />
                      )}
                      {!admin && (
                        <button
                          className="sidebar-cta"
                          onClick={() => setModal("report")}
                        >
                          <span className="cta-icon">
                            <Plus size={19} />
                          </span>
                          <span>
                            <b>¿Viste algo en tu barrio?</b>
                            <small>Ayuda a que más personas lo sepan.</small>
                          </span>
                          <ArrowUpRight size={19} />
                        </button>
                      )}
                      <p className="sidebar-note">
                        <ShieldCheck size={13} />
                        {admin
                          ? "Las acciones quedan registradas."
                          : "Solo publicaciones revisadas por moderación."}
                      </p>
                    </aside>
                    <div className="main-map">
                      <CityMap
                        reports={filtered}
                        selected={selected ?? undefined}
                        onSelect={openDetail}
                        center={center}
                      />
                      <div className="map-label">
                        <span className="tiny-dot" />
                        <b>Santiago, Chile</b>
                        <span>Piloto ciudadano</span>
                      </div>
                      <button
                        className="map-locate"
                        onClick={gps}
                        aria-label="Centrar el mapa en mi ubicación"
                      >
                        <LocateFixed size={20} />
                      </button>
                      {!loading && !error && !filtered.length && (
                        <div className="map-empty">
                          <span>
                            <MapPin size={19} />
                          </span>
                          <div>
                            <b>Un mapa que construimos juntos.</b>
                            <p>Aquí aparecerán los reportes publicados.</p>
                          </div>
                        </div>
                      )}
                      <div className="map-legend">
                        <span>
                          <i style={{ background: "#158b99" }} />
                          Agua
                        </span>
                        <span>
                          <i style={{ background: "#bc820a" }} />
                          Tránsito
                        </span>
                        <span>
                          <i style={{ background: "#d77551" }} />
                          Daños
                        </span>
                        <span>
                          <i style={{ background: "#4d8e67" }} />
                          Entorno
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="below-map">
                  <div>
                    <span className="large-icon">
                      <Activity size={23} />
                    </span>
                    <div>
                      <b>Pequeños avisos. Una gran diferencia.</b>
                      <p>
                        {admin
                          ? "Tu revisión ayuda a mantener información útil y responsable."
                          : "Cada reporte ayuda a que Santiago esté mejor informado."}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setModal("activity")}
                  >
                    Ver actividad <ArrowRight size={17} />
                  </button>
                  <button
                    className="help-card"
                    onClick={() => setModal("help")}
                  >
                    <Phone size={18} />
                    <span>
                      ¿Hay una emergencia?<b>Accede a los canales oficiales</b>
                    </span>
                    <ArrowUpRight size={17} />
                  </button>
                </section>
              </>
            )}
          </>
        )}
      </main>
      <footer>
        <span>
          © {new Date().getFullYear()} Pulso Santiago · Una iniciativa de{" "}
          <b>BlueBox</b>
        </span>
        <div>
          <button onClick={() => setModal("privacy")}>Privacidad</button>
          <button onClick={() => setModal("terms")}>Términos</button>
          <button onClick={() => setModal("contact")}>Contacto</button>
          <a href="/admin">
            Administración <ArrowUpRight size={12} />
          </a>
        </div>
      </footer>
      <nav className="bottom-nav" aria-label="Navegación móvil">
        <button
          onClick={() => switchPanel("reports")}
          aria-current={panel === "reports" ? "page" : undefined}
        >
          <Compass size={20} />
          Explorar
        </button>
        <button
          onClick={() => switchPanel("news")}
          aria-current={panel === "news" ? "page" : undefined}
        >
          <Activity size={20} />
          Pulso Ahora
        </button>
        <button
          className="bottom-report"
          onClick={() => setModal("report")}
          aria-label="Reportar problema"
        >
          <Plus size={23} />
          Reportar
        </button>
        <button onClick={() => setModal("zone")}>
          <MapPin size={20} />
          Mi zona
        </button>
      </nav>
      {selected && (
        <Modal
          title={admin ? "Revisar reporte" : "Reporte ciudadano"}
          onClose={closeDetail}
          wide
        >
          <Detail
            key={selected}
            reportId={selected}
            admin={admin}
            onChanged={refresh}
          />
        </Modal>
      )}
      {modal && (
        <Modal
          title={
            modal === "report"
              ? "Nuevo reporte"
              : modal === "zone"
                ? "Mi zona"
                : modal === "help"
                  ? "Ayuda y emergencias"
                  : modal === "how"
                    ? "Tu aviso puede hacer la diferencia."
                    : modal === "activity"
                      ? "El pulso de nuestras comunas"
                      : modal === "privacy"
                        ? "Privacidad"
                        : modal === "terms"
                          ? "Términos de uso"
                          : "Contacto"
          }
          onClose={() => setModal(null)}
          wide={modal === "report"}
        >
          {modal === "report" ? (
            <ReportComposer onDone={() => setModal(null)} />
          ) : modal === "zone" ? (
            <div className="zone-picker">
              <p>
                Elige tu comuna habitual. Solo guardamos esta preferencia en
                este dispositivo.
              </p>
              <label>
                Mi comuna
                <select
                  value={commune}
                  onChange={(e) => {
                    setCommune(e.target.value);
                    try {
                      localStorage.setItem("pulso-zone", e.target.value);
                    } catch {
                      /* storage unavailable */
                    }
                  }}
                >
                  <option value="all">Todas las comunas</option>
                  {communes.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <button
                className="primary"
                onClick={() => {
                  switchPanel("reports");
                  setModal(null);
                }}
              >
                Ver mi zona
              </button>
            </div>
          ) : modal === "help" ? (
            <>
              <p className="modal-lead">
                Si una persona está en peligro, contacta directamente a los
                servicios oficiales.
              </p>
              <div className="emergency-grid">
                {[
                  { n: "131", name: "Ambulancia · SAMU", color: "#bc5852" },
                  { n: "132", name: "Bomberos", color: "#bc820a" },
                  { n: "133", name: "Carabineros", color: "#22564d" },
                ].map((s) => (
                  <a
                    href={`tel:${s.n}`}
                    key={s.n}
                    style={{ "--emergency": s.color } as React.CSSProperties}
                  >
                    <Phone size={23} />
                    <b>{s.n}</b>
                    <span>{s.name}</span>
                    <small>
                      Llamar <ArrowUpRight size={13} />
                    </small>
                  </a>
                ))}
              </div>
              <div className="notice">
                Pulso Santiago comparte información ciudadana. No tiene central
                de rescate ni despacha equipos de emergencia.
              </div>
              <a
                className="resource-link"
                href="https://www.senapred.cl/"
                target="_blank"
                rel="noreferrer"
              >
                Información oficial de SENAPRED <ArrowUpRight size={17} />
              </a>
            </>
          ) : modal === "how" ? (
            <>
              <p className="modal-lead">
                Descubre, reporta y sigue los problemas del espacio público.
                Gratis y sin crear una cuenta.
              </p>
              <div className="how-steps">
                {[
                  {
                    n: "01",
                    icon: MapIcon,
                    title: "Mira lo que ocurre",
                    text: "Explora el mapa o el listado. Filtra por comuna y tipo de problema.",
                  },
                  {
                    n: "02",
                    icon: Plus,
                    title: "Comparte lo que ves",
                    text: "Cuenta qué pasó, marca el lugar y agrega fotografías si puedes.",
                  },
                  {
                    n: "03",
                    icon: ShieldCheck,
                    title: "Revisamos antes de publicar",
                    text: "El equipo de moderación revisa el contenido. Publicarlo no significa que esté verificado.",
                  },
                  {
                    n: "04",
                    icon: CheckCircle2,
                    title: "Sigue cada avance",
                    text: "Consulta confirmaciones e historial. Las resoluciones requieren evidencia.",
                  },
                ].map((s) => (
                  <div key={s.n}>
                    <span>{s.n}</span>
                    <s.icon size={24} />
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="primary full"
                onClick={() => setModal("report")}
              >
                Crear mi primer reporte <ArrowRight size={18} />
              </button>
            </>
          ) : modal === "activity" ? (
            <>
              <p className="modal-lead">
                Actividad en los {reports.length} reportes{" "}
                {admin ? "cargados" : "publicados más recientes"} del piloto.
              </p>
              <div className="metrics">
                <div>
                  <span>Reportes</span>
                  <b>{reports.length}</b>
                </div>
                <div>
                  <span>Sin resolver</span>
                  <b>{active}</b>
                </div>
                <div>
                  <span>Resueltos</span>
                  <b>{resolved}</b>
                </div>
              </div>
              <h3>Por comuna</h3>
              <div className="commune-stats">
                {communes.map((c) => (
                  <div key={c}>
                    <span>{c}</span>
                    <b>{reports.filter((r) => r.commune === c).length}</b>
                  </div>
                ))}
              </div>
              {!configured && (
                <p className="notice">
                  Sin conexión a datos. Los ceros no describen la situación real
                  de la ciudad.
                </p>
              )}
              <p className="small">
                Los reportes son aportes ciudadanos. Estas cifras no evalúan la
                gestión municipal y se limitan a los últimos 300 registros
                cargados.
              </p>
            </>
          ) : modal === "privacy" ? (
            <>
              <p className="notice">
                Borrador para revisión antes del piloto público.
              </p>
              <p>
                Recopilamos la descripción, comuna, ubicación del problema y las
                fotografías que adjuntes. No solicitamos nombre ni correo para
                reportar. El servidor elimina metadatos fotográficos mediante
                recodificación.
              </p>
              <p>
                Los contenidos pendientes permanecen privados. Al aprobarse, se
                publican sus datos y fotografías. Las confirmaciones y límites
                de envío usan una huella criptográfica de la conexión; no se
                publica la dirección IP.
              </p>
              <p>
                No compartas rostros, patentes, documentos, domicilios
                particulares o ubicaciones de personas en peligro. En cada
                reporte publicado puedes solicitar una revisión por privacidad
                usando el botón de bandera.
              </p>
              <p>
                Antes del lanzamiento deben definirse responsable, contacto,
                plazos de retención y procedimiento de acceso, rectificación y
                eliminación. El sitio todavía no ofrece un canal operativo para
                estas solicitudes fuera de reportes publicados.
              </p>
            </>
          ) : modal === "terms" ? (
            <>
              <p className="notice">
                Borrador para revisión antes del piloto público.
              </p>
              <p>
                Utiliza Pulso Santiago para reportar problemas del espacio
                público con respeto y evidencia. Evita acusaciones personales,
                publicidad y contenido falso. El equipo puede rechazar u ocultar
                publicaciones y debe registrar el motivo.
              </p>
              <p>
                Las publicaciones son aportes ciudadanos; revisa su fecha y
                estado. La aprobación para publicar no equivale a verificación
                oficial. No se afirma que una municipalidad recibió un aviso sin
                comprobante.
              </p>
              <p>
                Pulso Santiago no reemplaza servicios oficiales de emergencia.
                Condiciones definitivas y responsable operativo pendientes de
                revisión.
              </p>
            </>
          ) : (
            <>
              <span className="large-icon">
                <CircleHelp size={26} />
              </span>
              <p className="modal-lead">
                Una iniciativa de BlueBox para una ciudad mejor informada.
              </p>
              <p>
                El canal público de contacto se habilitará antes del piloto.
                Para revisar un reporte publicado, usa la bandera en su página
                de detalle.
              </p>
              <p className="small">
                No se reciben solicitudes de rescate por esta plataforma.
              </p>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
