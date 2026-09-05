import { useState, useEffect, useCallback } from 'react';
import useInterval from './useInterval';
import { fetchMapaGovernador } from '../services/apuracao.service';

const POLL_MS = 30 * 1000;

/**
 * Busca o resultado de Governador para as 27 UFs de uma vez (usado pelo
 * mapa no desktop e pela barra agregada no mobile). Só busca/atualiza
 * enquanto `ativo` for true, para não gastar chamadas à toa quando o
 * usuário está numa aba diferente (Presidente, Legislativo).
 */
export default function useMapaGovernador(ativo) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const resultado = await fetchMapaGovernador();
      setDados(resultado);
    } catch (e) {
      console.error('[mapa-governador]', e);
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
