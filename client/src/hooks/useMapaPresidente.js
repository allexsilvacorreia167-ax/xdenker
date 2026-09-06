import { useState, useEffect, useCallback } from 'react';
import useInterval from './useInterval';
import { fetchMapaPresidente } from '../services/apuracao.service';

const POLL_MS = 30 * 1000;

/**
 * Busca o candidato líder de Presidente por UF (usado para colorir o mapa
 * na aba Presidente — mesma mecânica de useMapaGovernador, cargo diferente).
 */
export default function useMapaPresidente(ativo) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const resultado = await fetchMapaPresidente();
      setDados(resultado);
    } catch (e) {
      console.error('[mapa-presidente]', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ativo) return;
    setLoading(true);
    carregar();
  }, [ativo, carregar]);

  useInterval(carregar, ativo ? POLL_MS : null);

  return { dados, loading };
}
