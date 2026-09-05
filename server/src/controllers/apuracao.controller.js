import {
  getResultadoPresidente,
  getResultadoGovernador,
  getMapaGovernador,
  getResultadoLegislativo,
} from '../services/apuracao.service.js';

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
