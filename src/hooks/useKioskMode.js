import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'cira:kiosk';

function readKioskFromUrl() {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('kiosk');
    return value === 'true' || value === '1';
  } catch {
    return false;
  }
}

function readKioskFromStorage() {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeKioskUrl(enabled) {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (enabled) {
      url.searchParams.set('kiosk', 'true');
    } else {
      url.searchParams.delete('kiosk');
    }
    window.history.replaceState({}, '', url.toString());
  } catch {
    /* noop */
  }
}

/**
 * Retorna [isKiosk, setKiosk]. Ativa via querystring `?kiosk=true` (ou `?kiosk=1`)
 * e persiste em sessionStorage para sobreviver a navegações internas.
 */
export function useKioskMode() {
  const [isKiosk, setIsKioskState] = useState(() => {
    const fromUrl = readKioskFromUrl();
    if (fromUrl) {
      try { window.sessionStorage.setItem(STORAGE_KEY, 'true'); } catch { /* noop */ }
      return true;
    }
    return readKioskFromStorage();
  });

  const setKiosk = useCallback((value) => {
    const next = Boolean(value);
    try {
      if (next) {
        window.sessionStorage.setItem(STORAGE_KEY, 'true');
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch { /* noop */ }
    writeKioskUrl(next);
    setIsKioskState(next);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const fromUrl = readKioskFromUrl();
      if (fromUrl) {
        try { window.sessionStorage.setItem(STORAGE_KEY, 'true'); } catch { /* noop */ }
        setIsKioskState(true);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return [isKiosk, setKiosk];
}

/**
 * Reset automático após inatividade quando em modo kiosk.
 */
export function useKioskInactivityReset(enabled, onReset, timeoutMs = 300000) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let timer;
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        onReset?.();
      }, timeoutMs);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'touchmove', 'wheel'];
    events.forEach((evt) => window.addEventListener(evt, reset, { passive: true }));
    reset();

    return () => {
      window.clearTimeout(timer);
      events.forEach((evt) => window.removeEventListener(evt, reset));
    };
  }, [enabled, onReset, timeoutMs]);
}
