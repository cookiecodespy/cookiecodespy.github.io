import {
  useCallback,
  useEffect,
  useState,
  useRef,
  type FormEvent,
} from "react";
import {
  ArrowUpRight,
  Newspaper,
  RefreshCw,
  Search,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { newsEnabled, newsRequest } from "./api";
const categories = [
  "Clima",
  "Emergencias",
  "Transporte",
  "Metro",
  "Infraestructura",
  "Servicios básicos",
  "Comunidad",
  "Otras noticias locales",
];
interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
  verified_at: string;
  category: string;
  commune: string;
  provenance: string;
  status: string;
}
interface Run {
  id: string;
  source_id: string;
  started_at: string;
  finished_at: string | null;
  status: string;
  inserted: number;
}
interface Feed {
  items: Article[];
  hasMore: boolean;
  runs: Run[];
  scheduling: string;
}
const time = (s: string) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(new Date(s));
export default function NewsFeed({ admin = false }: { admin?: boolean }) {
  const sequence = useRef(0);
  const [feed, setFeed] = useState<Feed>();
  const [commune, setCommune] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Article>();
  const [reason, setReason] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);
  const load = useCallback(async () => {
    if (!newsEnabled) {
      setLoading(false);
      return;
    }
    const current = ++sequence.current;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        commune,
        category,
        q,
        page: String(page),
      });
      const result = await newsRequest<Feed>(
        `${admin ? "/admin" : ""}/news?${params}`,
      );
      if (current === sequence.current) setFeed(result);
    } catch (e) {
      if (current === sequence.current)
        setError(
          e instanceof Error ? e.message : "No pudimos cargar las noticias.",
        );
    } finally {
      if (current === sequence.current) setLoading(false);
    }
  }, [admin, commune, category, q, page]);
  useEffect(() => {
    void load();
  }, [load]);
  async function refresh() {
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const result = await newsRequest<{
        message?: string;
        results?: { status: string }[];
      }>("/admin/news/refresh", {});
      setNotice(
        result.message ??
          (result.results?.some((r) => r.status === "error")
            ? "Actualización parcial. Algunas fuentes no respondieron; conservamos lo anterior."
            : "Fuentes consultadas. Las publicaciones ya están guardadas."),
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falló la actualización.");
    } finally {
      setBusy(false);
    }
  }
  async function moderate(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      await newsRequest("/admin/news/moderate", {
        id: editing.id,
        status: editing.status === "published" ? "hidden" : "published",
        reason,
      });
      setEditing(undefined);
      setReason("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos guardar.");
    } finally {
      setBusy(false);
    }
  }
  async function manual(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setBusy(true);
    setError("");
    try {
      await newsRequest("/admin/news/manual", {
        ...data,
        published_at: new Date(String(data.published_at)).toISOString(),
      });
      form.reset();
      setNotice("Enlace guardado.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Revisa los datos.");
    } finally {
      setBusy(false);
    }
  }
  const latest = feed?.runs.find((r) => r.status === "success");
  return (
    <section className="news-feed" aria-label="Noticias y avisos locales">
      <div className="news-heading">
        <div>
          <span className="eyebrow">
            <Newspaper size={16} /> INFORMACIÓN DE FUENTES EXTERNAS
          </span>
          <h2>
            Pulso <span>Ahora</span>
          </h2>
          <p>
            Tu ciudad también se cuenta aquí. Avisos oficiales, con su fuente a
            la vista.
          </p>
        </div>
        <div className="news-update">
          <Clock3 size={17} />
          <span>
            {latest
              ? `Consulta exitosa: ${time(latest.finished_at ?? latest.started_at)}`
              : "Todavía no hay una consulta exitosa registrada."}
            <small>Hora de Santiago · No es información en tiempo real.</small>
          </span>
        </div>
      </div>
      <p className="notice news-explainer">
        Una noticia informa sobre su fecha de publicación. No confirma que un
        incidente siga activo. Para emergencias, consulta directamente a los
        organismos oficiales.
      </p>
      {!newsEnabled ? (
        <p className="notice">
          Pulso Ahora funciona en el piloto privado de Sites. La integración de
          noticias con Supabase todavía no está activada.
        </p>
      ) : (
        <>
          <div className="news-filters">
            <label className="search-field">
              <Search size={18} />
              <input
                aria-label="Buscar noticias"
                placeholder="Busca noticias y avisos"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <label>
              Zona
              <select
                value={commune}
                onChange={(e) => {
                  setCommune(e.target.value);
                  setPage(0);
                }}
              >
                <option value="all">Todas las zonas</option>
                {["Metropolitana", "Santiago", "Providencia", "Ñuñoa"].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Tema
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(0);
                }}
              >
                <option value="all">Todos los temas</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <button
              className="text-button"
              onClick={() => {
                setSearch("");
                setQ("");
                setCommune("all");
                setCategory("all");
                setPage(0);
              }}
            >
              Restablecer
            </button>
          </div>
          {admin && (
            <div className="news-admin">
              <button
                className="primary"
                disabled={busy}
                onClick={() => void refresh()}
              >
                <RefreshCw size={17} />
                {busy ? "Consultando…" : "Consultar fuentes ahora"}
              </button>
              <details>
                <summary>Agregar enlace revisado</summary>
                <form onSubmit={manual} className="inline-form">
                  <label>
                    Titular breve
                    <input
                      name="title"
                      required
                      minLength={8}
                      maxLength={240}
                    />
                  </label>
                  <label>
                    Enlace original (HTTPS)
                    <input name="url" type="url" required />
                  </label>
                  <label>
                    Nombre de la fuente
                    <input
                      name="source"
                      required
                      minLength={3}
                      maxLength={120}
                    />
                  </label>
                  <label>
                    Fecha original (hora de tu dispositivo)
                    <input name="published_at" type="datetime-local" required />
                  </label>
                  <label>
                    Tema del enlace
                    <select name="category">
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Zona confirmada
                    <select name="commune">
                      {[
                        "Metropolitana",
                        "Santiago",
                        "Providencia",
                        "Ñuñoa",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <p className="small">
                    Verifica la fuente y la fecha antes de publicar. También
                    admite enlaces oficiales de X; no se consulta su API ni se
                    copia su contenido.
                  </p>
                  <button disabled={busy} className="primary">
                    Guardar enlace
                  </button>
                </form>
              </details>
            </div>
          )}
          {error && (
            <div className="error" role="alert">
              {error}{" "}
              <button className="text-button" onClick={() => void load()}>
                Reintentar
              </button>
            </div>
          )}
          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
          {loading ? (
            <div
              className="news-grid"
              aria-label="Cargando noticias"
              aria-busy="true"
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="news-card skeleton" />
              ))}
            </div>
          ) : feed?.items.length ? (
            <div className="news-grid">
              {feed.items.map((item) => {
                const old =
                  Date.now() - Date.parse(item.published_at) > 7 * 86400000;
                return (
                  <article
                    className={`news-card ${item.status === "hidden" ? "news-hidden" : ""}`}
                    key={item.id}
                  >
                    <div className="news-card-top">
                      <span className="news-topic">{item.category}</span>
                      <span>{item.commune}</span>
                    </div>
                    <h3>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.title}
                        <ArrowUpRight size={18} />
                      </a>
                    </h3>
                    <div className="news-source">
                      <ShieldCheck size={16} />
                      {item.source}
                    </div>
                    <p className="small">{item.provenance}</p>
                    <time dateTime={item.published_at}>
                      {time(item.published_at)}
                    </time>
                    {old && (
                      <span className="history-label">
                        Archivo · publicación de hace más de 7 días
                      </span>
                    )}
                    <a
                      className="news-link"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Leer en la fuente <ArrowUpRight size={15} />
                    </a>
                    {admin && (
                      <button
                        className="text-button"
                        onClick={() => {
                          setEditing(item);
                          setReason("");
                        }}
                      >
                        {item.status === "hidden"
                          ? "Volver a publicar"
                          : "Retirar publicación"}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            !error && (
              <div className="news-empty">
                <Newspaper size={36} />
                <h3>No hay publicaciones para esta selección</h3>
                <p>
                  Prueba otra zona o tema. Las noticias sin ubicación precisa
                  figuran como metropolitanas.
                </p>
              </div>
            )
          )}
          {editing && (
            <form className="inline-form" onSubmit={moderate}>
              <h3>
                {editing.status === "published" ? "Retirar" : "Publicar"}:{" "}
                {editing.title}
              </h3>
              <label>
                Motivo editorial
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  minLength={10}
                  maxLength={1000}
                  required
                />
              </label>
              <button className="primary" disabled={busy}>
                Confirmar cambio editorial
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => setEditing(undefined)}
              >
                Cancelar
              </button>
            </form>
          )}
          <div className="news-pagination">
            <button
              className="secondary"
              disabled={page === 0 || loading}
              onClick={() => setPage((n) => n - 1)}
            >
              Anterior
            </button>
            <span>Página {page + 1}</span>
            <button
              className="secondary"
              disabled={!feed?.hasMore || loading}
              onClick={() => setPage((n) => n + 1)}
            >
              Siguiente
            </button>
          </div>
          <details className="source-status">
            <summary>Fuentes y estado de actualización</summary>
            <p>{feed?.scheduling}</p>
            <p>
              Red Movilidad · Municipalidad de Santiago · Gobierno de Santiago.
              Se muestran titulares y enlaces, sin copiar artículos ni
              fotografías.
            </p>
            {feed?.runs.slice(0, 6).map((r) => (
              <p key={r.id}>
                {r.source_id} · {time(r.started_at)} ·{" "}
                {r.status === "success"
                  ? `Correcta · ${r.inserted} nuevas`
                  : r.status === "error"
                    ? "Falló la consulta; conservamos lo anterior"
                    : "En proceso"}
              </p>
            ))}
          </details>
        </>
      )}
    </section>
  );
}
