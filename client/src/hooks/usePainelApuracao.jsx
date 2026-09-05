import { useState, useEffect, useCallback } from 'react';

/**
 * Hook central do "painel fixado" de Apuração em Tempo Real.
 *
 * Regras (definidas em conjunto com o produto):
 * - sessionStorage: reinicializa sozinho ao fechar a aba/navegador.
 * - Expira também por inatividade de ~1 dia, mesmo com a aba aberta
 *   (checado a cada leitura/gravação, não precisa de timer próprio).
 * - Minimizar, trocar de aba do navegador, deixar em background NÃO conta
 *   como fechar — o painel continua igual.
 * - Perfil "fez a pesquisa": painel padrão vem do Supabase (uf + escolhas).
 * - Perfil "não fez a pesquisa": painel padrão é a última escolha manual
 *   feita durante a navegação (mesma regra de expiração).
 *
 * Uso:
 *   const painel = usePainelApuracao(preferenciaPesquisa);
 *   painel.uf                  -> UF atualmente em foco (ou null)
 *   painel.origem              -> 'pesquisa' | 'manual' | null
 *   painel.selecionarEstado(uf)-> troca o estado em foco (marca como manual)
 *   painel.registrarInteracao()-> atualiza o timestamp de última interação
 */

const STORAGE_KEY = 'xdenker_painel_apuracao';
const INATIVIDADE_MS = 24 * 60 * 60 * 1000; // 1 dia

function lerDoStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.lastInteraction) return null;

    const expirado = Date.now() - parsed.lastInteraction > INATIVIDADE_MS;
    if (expirado) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function salvarNoStorage(painel) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...painel, lastInteraction: Date.now() })
    );
  } catch {
    // sessionStorage indisponível (modo privado restrito, etc.) — segue sem persistir
  }
}

/**
 * @param {object|null} preferenciaPesquisa - { uf, presidenteId, governadorId }
 *   vindo do Supabase, se o usuário já fez a pesquisa interna. Passar `null`
 *   se o usuário ainda não fez (ou enquanto ainda está carregando).
 */
export default function usePainelApuracao(preferenciaPesquisa) {
  const [painel, setPainel] = useState(() => {
    const salvo = lerDoStorage();
    if (salvo) return salvo;

    if (preferenciaPesquisa?.uf) {
      return {
        uf: preferenciaPesquisa.uf,
        origem: 'pesquisa',
        presidenteId: preferenciaPesquisa.presidenteId || null,
        governadorId: preferenciaPesquisa.governadorId || null,
      };
    }

    // Sem sessão salva e sem pesquisa feita: nenhum estado em foco ainda
    // (ex.: usuário entrou direto em /apuracao pelo hambúrguer — só Presidente aparece)
    return { uf: null, origem: null, presidenteId: null, governadorId: null };
  });

  // Se a preferência da pesquisa chegar depois (ex.: carregada de forma assíncrona)
  // e ainda não houver nenhum painel fixado, adota ela como padrão.
  useEffect(() => {
    if (painel.uf === null && preferenciaPesquisa?.uf) {
      const novo = {
        uf: preferenciaPesquisa.uf,
        origem: 'pesquisa',
        presidenteId: preferenciaPesquisa.presidenteId || null,
        governadorId: preferenciaPesquisa.governadorId || null,
      };
      setPainel(novo);
      salvarNoStorage(novo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferenciaPesquisa]);

  const registrarInteracao = useCallback(() => {
    setPainel((atual) => {
      salvarNoStorage(atual);
      return atual;
    });
  }, []);

  const selecionarEstado = useCallback((uf) => {
    setPainel((atual) => {
      const novo = { ...atual, uf: uf.toUpperCase(), origem: 'manual' };
      salvarNoStorage(novo);
      return novo;
    });
  }, []);

  return {
    uf: painel.uf,
    origem: painel.origem,
    presidenteId: painel.presidenteId,
    governadorId: painel.governadorId,
    selecionarEstado,
    registrarInteracao,
  };
}
