import { useEffect, useRef } from "react";
type TurnstileAPI = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}
let load: Promise<void> | undefined;
function loadWidget() {
  if (window.turnstile) return Promise.resolve();
  if (!load)
    load = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        load = undefined;
        reject(new Error("No se pudo cargar la verificación."));
      };
      document.head.append(script);
    });
  return load;
}
export default function Turnstile({
  action,
  onToken,
}: {
  action: string;
  onToken: (token: string) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  callback.current = onToken;
  useEffect(() => {
    let active = true;
    let id: string | undefined;
    if (import.meta.env.VITE_TURNSTILE_SITE_KEY)
      loadWidget()
        .then(() => {
          if (active && el.current)
            id = window.turnstile!.render(el.current, {
              sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
              action,
              theme: "light",
              callback: (t: string) => callback.current(t),
              "expired-callback": () => callback.current(""),
              "error-callback": () => callback.current(""),
            });
        })
        .catch(() => callback.current(""));
    return () => {
      active = false;
      if (id) window.turnstile?.remove(id);
    };
  }, [action]);
  return (
    <div
      className="turnstile"
      ref={el}
      aria-label="Verificación de seguridad"
    />
  );
}
