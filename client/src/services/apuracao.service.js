import { apiFetch } from '../api';

/**
 * Chamadas ao módulo de Apuração em Tempo Real (backend /api/apuracao/*)
 * Mesmo padrão de apiFetch já usado em TseAutocomplete.jsx
 */

export async function fetchResultadoPresidente() {
  const res = await apiFetch('/api/apuracao/presidente');
  return res.json();
}

export async function fetchResultadoGovernador(uf) {
  const params = new URLSearchParams({ uf });
  const res = await apiFetch(`/api/apuracao/governador?${params}`);
  return res.json();
}

export async function fetchMapaGovernador() {
  const res = await apiFetch('/api/apuracao/mapa-governador');
  return res.json();
}

export async function fetchMapaPresidente() {
  const res = await apiFetch('/api/apuracao/mapa-presidente');
  return res.json();
}

// cargo: 'senador' | 'deputado_federal' | 'deputado_estadual'
export async function fetchResultadoLegislativo(cargo, uf) {
  const params = new URLSearchParams({ uf });
  const res = await apiFetch(`/api/apuracao/legislativo/${cargo}?${params}`);
  return res.json();
}

// { hasCompleted, uf, presidenteId, governadorId, depFederal, depEstadual, senador }
export async function fetchPreferenciasApuracao() {
  const res = await apiFetch('/api/apuracao/preferencias');
  return res.json();
}

export default {
  fetchResultadoPresidente,
  fetchResultadoGovernador,
  fetchMapaGovernador,
  fetchMapaPresidente,
  fetchResultadoLegislativo,
  fetchPreferenciasApuracao,
};
