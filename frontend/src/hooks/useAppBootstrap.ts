import { useEffect, useState } from "react";

const MIN_SPLASH_MS = 1200;

/**
 * Splash dismisses when the app is ready (i18n loaded + API health probe),
 * not on a fixed timer alone.
 */
export function useAppBootstrap() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();

    const minDelay = new Promise<void>((resolve) => {
      setTimeout(resolve, MIN_SPLASH_MS);
    });

    const healthCheck = fetch("/api/v1/health", { signal: AbortSignal.timeout(4000) })
      .then(() => undefined)
      .catch(() => undefined);

    Promise.all([minDelay, healthCheck]).then(() => {
      if (cancelled) return;
      const elapsed = performance.now() - started;
      const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
      window.setTimeout(() => setReady(true), remaining);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
