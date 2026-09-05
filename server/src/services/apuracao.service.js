/**
 * Serviço de Apuração em Tempo Real (TSE)
 *
 * ⚠️ ESTÁGIO MOCK — nenhuma chamada real a resultados.tse.jus.br ainda.
 * A estrutura de retorno de cada função já é a final esperada pelo front,
 * para permitir desenvolvimento em paralelo. Quando houver acesso testado
 * à API real de resultados, trocar apenas a geração de `votes`/`percent`/
 * `urnasApuradas` por dado real — enriquecimento de espectro, cor e
 * agregação continuam iguais.
 *
 * Não duplica nada de tse.service.js (cadastro de candidatos) nem de
 * admin.store.js (candidatos da pesquisa interna + espectro por partido) —
 * este arquivo só orquestra os dois.
 */


import {
  getPresidentCandidates,
  getGovernorCandidates,
  getSpectrumForParty,
} from './admin.store.js';
import { listCandidates, CARGO_CODES } from './tse.service.js';
import { ALL_PARTIES } from '../data/parties.js';

const ALL_UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

/** Degradê de 5 cores por espectro político — resolvido no backend, o front só exibe. */
export const SPECTRUM_COLORS = {
  Esquerda: '#C0392B',
  'Centro-Esquerda': '#E67E62',
  Centro: '#F1C40F',
  'Centro-Direita': '#52BE80',
  Direita: '#1E8449',
};

// Cache dedicado de resultado — TTL curto (30s), separado do cache de
// cadastro de candidatos (1h) usado em tse.service.js. Mesmo padrão (Map + TTL).
const resultCache = new Map();
const RESULT_TTL = 30 * 1000;

function cacheGet(key) {
  const item = resultCache.get(key);
  if (!item) return null;
  if (Date.now() - item.at > RESULT_TTL) {
    resultCache.delete(key);
    return null;
  }
  return item.data;
}

function cacheSet(key, data) {
  resultCache.set(key, { data, at: Date.now() });
}

// ---------- Geração de números mock ----------

function mockPercentages(n) {
  const raw = Array.from({ length: n }, () => Math.random());
  const sum = raw.reduce((s, v) => s + v, 0) || 1;
  const pct = raw.map((v) => (v / sum) * 100);
  pct.sort((a, b) => b - a);
  return pct;
}

function mockUrnasApuradas() {
  return Number((Math.random() * 100).toFixed(1));
}

function randomParty() {
  return ALL_PARTIES[Math.floor(Math.random() * ALL_PARTIES.length)].sigla;
}

async function enrichWithSpectrum(candidate) {
  const spectrum = await getSpectrumForParty(candidate.party);
  return {
    ...candidate,
    spectrum,
    color: SPECTRUM_COLORS[spectrum] || SPECTRUM_COLORS.Centro,
  };
}

async function buildResultFromCandidates(rawCandidates, totalVotesBase = 50_000_000) {
  const pct = mockPercentages(rawCandidates.length);
  const withVotes = rawCandidates.map((c, i) => ({
    id: c.id,
    name: c.name,
    party: c.party,
    number: c.number || '',
    photo: c.photo || null,
    percent: Number(pct[i].toFixed(2)),
    votes: Math.round((pct[i] / 100) * totalVotesBase),
  }));
  const enriched = await Promise.all(withVotes.map(enrichWithSpectrum));
  enriched.sort((a, b) => b.percent - a.percent);
  return {
    candidates: enriched,
    leader: enriched[0] || null,
    urnasApuradas: mockUrnasApuradas(),
    updatedAt: new Date().toISOString(),
    source: 'mock',
  };
}

// ---------- PRESIDENTE (nacional, sem UF) ----------

export async function getResultadoPresidente() {
  const key = 'resultado:presidente';
  const cached = cacheGet(key);
  if (cached) return cached;

  const candidates = await getPresidentCandidates(true);
  const result = candidates.length
    ? await buildResultFromCandidates(candidates)
    : {
      candidates: [],
      leader: null,
      urnasApuradas: 0,
      updatedAt: new Date().toISOString(),
      source: 'mock',
      warning: 'Nenhum candidato de presidente cadastrado no ADM',
    };

  const payload = { cargo: 'presidente', uf: null, ...result };
  cacheSet(key, payload);
  return payload;
}

// ---------- GOVERNADOR (por UF) ----------

export async function getResultadoGovernador(uf) {
  const ufUpper = (uf || 'CE').toUpperCase();
  const key = `resultado:governador:${ufUpper}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  let candidates = await getGovernorCandidates(ufUpper, true);

  // Fallback: se o ADM ainda não tem candidatos cadastrados para essa UF,
  // gera 2 candidatos sintéticos só para a tela não ficar vazia no estágio mock.
  if (!candidates.length) {
    candidates = [
      { id: `${ufUpper.toLowerCase()}-mock-1`, name: 'Candidato A (mock)', party: randomParty(), number: '11' },
      { id: `${ufUpper.toLowerCase()}-mock-2`, name: 'Candidato B (mock)', party: randomParty(), number: '22' },
    ];
  }

  const result = await buildResultFromCandidates(candidates, 3_000_000);
  const payload = { cargo: 'governador', uf: ufUpper, ...result };
  cacheSet(key, payload);
  return payload;
}

// ---------- MAPA DE GOVERNADOR (todas as UFs, para colorir o mapa) ----------

export async function getMapaGovernador() {
  const key = 'mapa:governador';
  const cached = cacheGet(key);
  if (cached) return cached;

  const results = await Promise.all(
    ALL_UFS.map(async (uf) => {
      const r = await getResultadoGovernador(uf);
      return {
        uf,
        leaderSpectrum: r.leader?.spectrum || 'Centro',
        color: r.leader?.color || SPECTRUM_COLORS.Centro,
      };
    })
  );

  const payload = {
    source: 'mock',
    updatedAt: new Date().toISOString(),
    ufs: results,
  };
  cacheSet(key, payload);
  return payload;
}

// ---------- LEGISLATIVO (Senador, Dep. Federal, Dep. Estadual) ----------

// Nº de vagas mockado por cargo — TODO: trocar por dado real de vagas por UF quando disponível.
const MOCK_SEATS = {
  senador: 1,
  deputado_federal: 8,
  deputado_estadual: 24,
};

export async function getResultadoLegislativo(cargoName, uf) {
  const ufUpper = (uf || 'CE').toUpperCase();
  const key = `resultado:${cargoName}:${ufUpper}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const cargoCode = CARGO_CODES[cargoName];
  if (!cargoCode) {
    throw new Error(`Cargo legislativo inválido: ${cargoName}`);
  }

  // Reaproveita o cadastro real de candidatos do TSE (DivulgaCandContas),
  // já resolvido em tse.service.js — não duplica a chamada à API.
  const registro = await listCandidates(2026, ufUpper, cargoCode);
  const seats = MOCK_SEATS[cargoName] || 8;
  const eleitosBase = registro.candidates.slice(0, seats);

  let result;
  if (eleitosBase.length) {
    result = await buildResultFromCandidates(eleitosBase, 1_000_000);
  } else {
    result = {
      candidates: [],
      leader: null,
      urnasApuradas: 0,
      updatedAt: new Date().toISOString(),
      source: 'mock',
      warning: 'Sem candidatos cadastrados no TSE para este recorte',
    };
  }

  // Agregação por espectro — números absolutos de eleitos por faixa, para a barra.
  const porEspectro = {
    Esquerda: 0,
    'Centro-Esquerda': 0,
    Centro: 0,
    'Centro-Direita': 0,
    Direita: 0,
  };
  result.candidates.forEach((c) => {
    porEspectro[c.spectrum] = (porEspectro[c.spectrum] || 0) + 1;
  });

  const payload = {
    cargo: cargoName,
    uf: ufUpper,
    totalEleitos: result.candidates.length,
    porEspectro,
    eleitos: result.candidates,
    updatedAt: result.updatedAt,
    source: result.source,
    ...(result.warning ? { warning: result.warning } : {}),
  };
  cacheSet(key, payload);
  return payload;
}

export default {
  SPECTRUM_COLORS,
  getResultadoPresidente,
  getResultadoGovernador,
  getMapaGovernador,
  getResultadoLegislativo,
};
