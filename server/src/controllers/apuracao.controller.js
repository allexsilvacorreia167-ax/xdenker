import {
  getResultadoPresidente,
  getResultadoGovernador,
  getMapaGovernador,
  getResultadoLegislativo,
} from '../services/apuracao.service.js';
import { getUserSurveyResponse } from '../services/results.store.js';

export const presidente = async (req, res) => {
  try {
    const data = await getResultadoPresidente();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Falha ao buscar apuração de presidente', detail: e.message });
  }
};

export const governador = async (req, res) => {
  try {
    const uf = req.query.uf;
    const data = await getResultadoGovernador(uf);
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Falha ao buscar apuração de governador', detail: e.message });
  }
};

// Todas as 27 UFs de uma vez, já com cor por espectro — usado pelo mapa (desktop)
export const mapaGovernador = async (req, res) => {
  try {
    const data = await getMapaGovernador();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Falha ao montar mapa de governador', detail: e.message });
  }
};

// cargo: senador | deputado_federal | deputado_estadual
export const legislativo = async (req, res) => {
  try {
    const { cargo } = req.params;
    const uf = req.query.uf;
    const data = await getResultadoLegislativo(cargo, uf);
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Falha ao buscar apuração legislativa', detail: e.message });
  }
};

/**
 * Preferências do usuário na pesquisa interna (Supabase), usadas pelo front
 * para decidir o painel padrão da apuração (uf + candidatos escolhidos).
 * Segue o mesmo padrão de research.controller.js (req.user?.id com fallback
 * para header x-user-id) — não exige middleware de auth obrigatório, já que
 * um usuário anônimo simplesmente recebe hasCompleted: false.
 */
export const preferencias = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'];
    if (!userId) {
      return res.json({ hasCompleted: false, uf: null, presidenteId: null, governadorId: null });
    }

    const resposta = await getUserSurveyResponse(userId);
    if (!resposta) {
      return res.json({ hasCompleted: false, uf: null, presidenteId: null, governadorId: null });
    }

    res.json({
      hasCompleted: true,
      uf: resposta.stateUF,
      presidenteId: resposta.presidentId,
      governadorId: resposta.governorId,
      depFederal: resposta.depFederal,
      depEstadual: resposta.depEstadual,
      senador: resposta.senador,
    });
  } catch (e) {
    res.status(500).json({ error: 'Falha ao buscar preferências do usuário', detail: e.message });
  }
};
