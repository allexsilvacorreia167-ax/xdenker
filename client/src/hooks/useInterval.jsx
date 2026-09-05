import { useEffect, useRef } from 'react';

/**
 * Chama `callback` a cada `delayMs` enquanto o componente estiver montado.
 * `delayMs = null` pausa o polling (útil para não bater na API quando a
 * aba está em background, se quiser ligar isso no futuro via
 * document.visibilityState).
 */
export default function useInterval(callback, delayMs) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayMs === null) return undefined;
    const id = setInterval(() => savedCallback.current(), delayMs);
    return () => clearInterval(id);
  }, [delayMs]);
}
