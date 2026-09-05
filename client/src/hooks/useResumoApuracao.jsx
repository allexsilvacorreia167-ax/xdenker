import { useState, useEffect, useCallback } from 'react';
import useInterval from './useInterval';
import {
  fetchResultadoPresidente,
  fetchResultadoGovernador,
} from '../services/apuracao.service';

const POLL_MS = 30 * 1000;

/**
 * Busca e mantém atualizados os resultados de Presidente + Governador
 * para o `uf` atualmente fixado no painel (ver usePainelApuracao).
 *
 * Regra de exibição (Home e resumo):
 * - uf === null -> só Presidente é buscado (Governador fica null)
 * - uf definido -> Presidente + Governador daquele estado
 *
 * A troca de candidato-em-foco (quando o usuário fez a pesquisa e o
 * candidato escolhido não está no top 3) é resolvida aqui, comparando
 * `presidenteId`/`governadorId` do painel com a lista recebida do backend.
 */
export default function useResumoApuracao({ uf, presidenteId, governadorId }) {
  const [presidente, setPresidente] = useState(null);
  const [governador, setGovernador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      const tarefas = [fetchResultadoPresidente()];
      if (uf) tarefas.push(fetchResultadoGovernador(uf));

      const [dadosPresidente, dadosGovernador] = await Promise.all(tarefas);

      setPresidente(aplicarRegraDosTres(dadosPresidente, presidenteId));
      setGovernador(uf ? aplicarRegraDosTres(dadosGovernador, governadorId) : null);
      setErro(null);
    } catch (e) {
      setErro(e.message || 'Falha ao carregar apuração');
    } finally {
      setLoading(false);
    }
  }, [uf, presidenteId, governadorId]);

  useEffect(() => {
    setLoading(true);
    carregar();
  }, [carregar]);

  useInterval(carregar, POLL_MS);

  return { presidente, governador, loading, erro, recarregar: carregar };
}

/**
 * Regra dos 3 candidatos (ver especificação):
 * - Sem escolha do usuário -> top 3 como veio do backend.
 * - Escolha do usuário já está no top 3 -> mantém o top 3.
 * - Escolha do usuário fora do top 3 -> top 2 + a escolha do usuário no lugar do 3º.
 */
function aplicarRegraDosTres(resultado, candidatoEscolhidoId) {
  if (!resultado?.candidates?.length) return resultado;

  const top3 = resultado.candidates.slice(0, 3);
  if (!candidatoEscolhidoId) {
    return { ...resultado, exibidos: top3 };
  }

  const jaEstaNoTop3 = top3.some((c) => c.id === candidatoEscolhidoId);
  if (jaEstaNoTop3) {
    return { ...resultado, exibidos: top3 };
  }

  const escolhido = resultado.candidates.find((c) => c.id === candidatoEscolhidoId);
  if (!escolhido) {
    // candidato escolhido não apareceu no resultado (ex.: cargo diferente) — mantém top 3
    return { ...resultado, exibidos: top3 };
  }

  return { ...resultado, exibidos: [...top3.slice(0, 2), escolhido] };
}
