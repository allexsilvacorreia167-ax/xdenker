/**
 * Integração real com fontes oficiais do TSE
 *
 * Fontes:
 * 1. resultados.tse.jus.br — JSON de apuração (candidatos executivos)
 * 2. DivulgaCandContas REST (quando disponível)
 * 3. Fallback local alinhado às siglas oficiais
 *
 * Cargos: 1=Presidente, 3=Governador, 5=Senador, 6=Dep.Federal, 7=Dep.Estadual
 */

const RESULTADOS_BASE = 'https://resultados.tse.jus.br/oficial';
const DIVULGA_BASE = 'https://divulgacandcontas.tse.jus.br/divulga/rest/v1';

const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

// Códigos de eleição conhecidos (1º turno)
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

/** Busca o ID da eleição atual dinamicamente ou recorre ao mapeamento */
async function getActiveElectionId(year) {
  try {
    const data = await httpJson(`${DIVULGA_BASE}/eleicao/listar`);
    const list = Array.isArray(data) ? data : data.eleicoes;
    if (list) {
      const election = list.find(e => e.ano === Number(year));
      if (election && election.id) return String(election.id);
    }
  } catch (e) {
    console.warn('[TSE eleicao/listar] Falha ao buscar ID dinâmico, usando fallback estático:', e.message);
  }

  // Fallback para o mapeamento estático se a listagem falhar
  const meta = ELECTION_CODES[year];
  return meta ? meta.codigo : null;
}

/** Lista eleições conhecidas + tentativa na API Divulga */
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

/**
 * Candidatos via resultados.tse.jus.br (JSON oficial de apuração)
 */
async function fromResultados(year, uf, cargoCode) {
  const meta = ELECTION_CODES[year];
  if (!meta) throw new Error(`Ano ${year} sem código de eleição mapeado`);

  const abr = uf.toLowerCase() === 'br' ? 'br' : uf.toLowerCase();
  const cargoPad = String(cargoCode).padStart(4, '0');
  const eleCode = (cargoCode !== 1 && meta.codigoEstadual) ? meta.codigoEstadual : meta.codigo;
  const url = `${RESULTADOS_BASE}/${meta.ciclo}/${eleCode}/dados-simplificados/${abr}/${abr}-c${cargoPad}-e${eleCode.padStart(6, '0')}-r.json`;

  const raw = await httpJson(url);
  const cand = Array.isArray(raw?.cand) ? raw.cand : [];

  return {
    source: 'tse-resultados',
    year,
    uf: uf.toUpperCase(),
    cargo: cargoCode,
    total: cand.length,
    url,
    candidates: cand.map((c) => ({
      id: String(c.sqcand || c.n || `${c.nm}-${c.n}`),
      name: c.nm || c.nmu || '',
      fullName: c.nm || '',
      party: (c.cc || c.p || '').split(' - ')[0]?.trim().toUpperCase() || '',
      number: String(c.n || ''),
      votes: c.vap ? Number(String(c.vap).replace(/\./g, '')) : null,
      percent: c.pvap || null,
      elected: c.st === 'Eleito' || c.st === 'Eleito por QP' || c.st === 'Eleito por média',
      situation: c.st || null,
      photo: null,
    })).filter((c) => c.name),
  };
}

/** Tentativa DivulgaCandContas com ID dinâmico */
async function fromDivulga(year, uf, cargoCode) {
  const eleCode = await getActiveElectionId(year);
  if (!eleCode) throw new Error(`Não foi possível obter o código da eleição para o ano ${year}`);

  // Rota de listagem geral de candidatos do TSE
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

  // Mapeando apenas o essencial para a listagem (Nome, Número, Partido e UF)
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
  // Retorna vazio para evitar dados obsoletos de anos anteriores
  return [];
}

/**
 * Lista candidatos — tenta Resultados → Divulga → fallback
 */
export async function listCandidates(year, uf, cargo) {
  const cargoCode = typeof cargo === 'string' ? CARGO_CODES[cargo] || Number(cargo) : cargo;
  const key = `cand:${year}:${uf}:${cargoCode}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  // 1) Resultados TSE (melhor para executivos 2022+)
  if ([1, 3].includes(cargoCode) && ELECTION_CODES[year]) {
    try {
      const data = await fromResultados(year, uf, cargoCode);
      if (data.candidates.length > 0) {
        cacheSet(key, data);
        return data;
      }
    } catch (e) {
      console.warn('[TSE resultados]', e.message);
    }
  }

  // 2) DivulgaCandContas
  try {
    const data = await fromDivulga(year, uf, cargoCode);
    if (data.candidates.length > 0) {
      cacheSet(key, data);
      return data;
    }
  } catch (e) {
    console.warn('[TSE divulga]', e.message);
  }

  // 3) Fallback limpo
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
        (c.fullName || '').toLowerCase().includes(q) ||
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
  try {
    const pres = await listCandidates(year, 'BR', 1);
    const found = pres.candidates.find((c) => c.id === String(id));
    if (found) return { ...found, source: pres.source };
  } catch { /* ignore */ }
  return { id, error: 'Candidato não encontrado', source: 'error' };
}

export default {
  listElections,
  listCandidates,
  searchLegislative,
  getCandidateDetail,
  CARGO_CODES,
};