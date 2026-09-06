import { useEffect, useState } from 'react';

/**
 * Tracks whether an image URL has finished downloading/decoding.
 * Useful to fade in background images instead of letting the browser
 * paint them progressively (which looks like the image "streaming down"
 * on slow connections).
 */
export function useImagePreload(src) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    setLoaded(false);

    let cancelled = false;
    const img = new Image();
    img.src = src;
    img.decode
      ? img.decode().then(() => !cancelled && setLoaded(true)).catch(() => !cancelled && setLoaded(true))
      : (img.onload = () => !cancelled && setLoaded(true));

    if (img.complete) setLoaded(true);

    return () => {
      cancelled = true;
    };
  }, [src]);

  return loaded;
}
