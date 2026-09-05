import { useState, useEffect, useCallback } from 'react';
import useInterval from './useInterval';
import {
  fetchResultadoPresidente,
  fetchResultadoGovernador,
  fetchResultadoLegislativo,
} from '../services/apuracao.service';

const POLL_MS = 30 * 1000;
const CARGOS_LEGISLATIVOS = ['senador', 'deputado_federal', 'deputado_estadual'];

/**
 * Busca o resultado do cargo selecionado na página completa de Apuração.
 * - presidente: nacional, `uf` é ignorado
 * - governador / legislativo: dependem de `uf`; sem uf, não busca ainda
 */
export default function useApuracaoCargo(cargo, uf) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      let resultado = null;

      if (cargo === 'presidente') {
        resultado = await fetchResultadoPresidente();
      } else if (cargo === 'governador') {
        if (uf) resultado = await fetchResultadoGovernador(uf);
      } else if (CARGOS_LEGISLATIVOS.includes(cargo)) {
        if (uf) resultado = await fetchResultadoLegislativo(cargo, uf);
      }

      setDados(resultado);
      setErro(null);
    } catch (e) {
      setErro(e.message || 'Falha ao carregar apuração');
    } finally {
      setLoading(false);
    }
  }, [cargo, uf]);

  useEffect(() => {
    setLoading(true);
    carregar();
  }, [carregar]);

  useInterval(carregar, POLL_MS);

  return { dados, loading, erro, recarregar: carregar };
}
