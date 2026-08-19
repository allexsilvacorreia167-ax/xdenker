/**
 * Integração real com fontes oficiais do TSE
 * Cargos: 1=Presidente, 3=Governador, 5=Senador, 6=Dep.Federal, 7=Dep.Estadual
 */

const RESULTADOS_BASE = 'https://resultados.tse.jus.br/oficial';
const DIVULGA_BASE = 'https://divulgacandcontas.tse.jus.br/divulga/rest/v1';

const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

const ELECTION_CODES = {
  2022: { ciclo: 'ele2022', codigo: '544', codigoEstadual: '546', codigo2t: '545' },
  2024: { ciclo: 'ele2024', codigo: '619' },
  2026: { ciclo: 'ele2026', codigo: '203220026', codigoEstadual: '203220026' },
};

export const CARGO_CODES = {
  presidente: 1,
  governador: 3,
  senador: 5,
  deputado_federal: 6,
  deputado_estadual: 7,
};

function cacheGet(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.at > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function cacheSet(key, data) {
  cache.set(key, { data, at: Date.now() });
}

async function httpJson(url) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'XDENKER/1.0 (pesquisa-eleitoral; +https://xdenker.local)',
    },
  });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${url}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function getActiveElectionId(year) {
  try {
    const data = await httpJson(`${DIVULGA_BASE}/eleicao/listar`);
    const list = Array.isArray(data) ? data : data.eleicoes;
    if (list) {
      const election = list.find(e => e.ano === Number(year));
      if (election && election.id) return String(election.id);
    }
  } catch (e) {
    console.warn('[TSE eleicao/listar] Falha, usando fallback estático:', e.message);
  }
  const meta = ELECTION_CODES[year];
  return meta ? meta.codigo : null;
}

export async function listElections() {
  const key = 'eleicoes';
  const cached = cacheGet(key);
  if (cached) return cached;

  const local = Object.entries(ELECTION_CODES).map(([year, meta]) => ({
    ano: Number(year),
    ciclo: meta.ciclo,
    codigo: meta.codigo,
    source: 'xdenker-catalog',
  }));

  try {
    const data = await httpJson(`${DIVULGA_BASE}/eleicao/listar`);
    const result = { source: 'tse-divulgacand', data, local };
    cacheSet(key, result);
    return result;
  } catch {
    const result = { source: 'local', eleicoes: local };
    cacheSet(key, result);
    return result;
  }
}

async function fromDivulga(year, uf, cargoCode) {
  const eleCode = await getActiveElectionId(year);
  if (!eleCode) throw new Error(`Não foi possível obter o código da eleição para o ano ${year}`);

  const path = `/candidatura/listar/${eleCode}/${uf.toUpperCase()}/${cargoCode}/candidatos`;
  const raw = await httpJson(`${DIVULGA_BASE}${path}`);

  let list = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (Array.isArray(raw?.candidatos)) {
    list = raw.candidatos;
  } else if (Array.isArray(raw?.data)) {
    list = raw.data;
  }

  // Mapeamento limpo contendo apenas nome, número, partido e UF
  return {
    source: 'tse-divulgacand',
    year,
    uf: uf.toUpperCase(),
    cargo: cargoCode,
    total: list.length,
    candidates: list.map((c) => ({
      id: String(c.id || c.sqCand || ''),
      name: c.nomeUrna || c.nome || '',
      party: (c.partido?.sigla || c.siglaPartido || '').toUpperCase(),
      number: String(c.numero || c.numeroCandidato || ''),
      uf: uf.toUpperCase(),
    })).filter((c) => c.name && c.number),
  };
}

function fallbackCandidates(cargoCode, uf) {
  return [];
}

export async function listCandidates(year, uf, cargo) {
  const cargoCode = typeof cargo === 'string' ? CARGO_CODES[cargo] || Number(cargo) : cargo;
  const key = `cand:${year}:${uf}:${cargoCode}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  try {
    const data = await fromDivulga(year, uf, cargoCode);
    if (data.candidates.length > 0) {
      cacheSet(key, data);
      return data;
    }
  } catch (e) {
    console.warn('[TSE divulga]', e.message);
  }

  const fb = {
    source: 'fallback',
    year,
    uf: uf.toUpperCase(),
    cargo: cargoCode,
    total: 0,
    candidates: fallbackCandidates(cargoCode, uf),
    warning: 'API TSE indisponível ou sem dados para este recorte.',
  };
  fb.total = fb.candidates.length;
  cacheSet(key, fb);
  return fb;
}

export async function searchLegislative(year, uf, cargo, query, limit = 20) {
  const data = await listCandidates(year, uf, cargo);
  const q = (query || '').toLowerCase().trim();
  let list = data.candidates;
  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.party.toLowerCase().includes(q) ||
        c.number.includes(q)
    );
  }
  return {
    ...data,
    total: list.length,
    candidates: list.slice(0, limit),
  };
}

export async function getCandidateDetail(year, id) {
  return { id, error: 'Detalhe não carregado na listagem', source: 'error' };
}

export default {
  listElections,
  listCandidates,
  searchLegislative,
  getCandidateDetail,
  CARGO_CODES,
};