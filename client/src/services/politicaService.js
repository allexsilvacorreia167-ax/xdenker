// src/services/politicaService.js
// Alinhado com a estrutura nova do Supabase:
// titulares | suplentes | executivo | judiciario

import { supabase } from '../lib/supabase';

const TAMANHO_PAGINA = 1000;

/**
 * Busca todos os registros de uma tabela com paginação automática
 */
async function buscarTodos(nomeTabela, filtros = {}) {
    let todos = [];
    let inicio = 0;

    while (true) {
        let query = supabase
            .from(nomeTabela)
            .select('*')
            .order('id', { ascending: true })
            .range(inicio, inicio + TAMANHO_PAGINA - 1);

        // Aplica filtros simples (eq)
        Object.entries(filtros).forEach(([chave, valor]) => {
            if (valor !== undefined && valor !== null) {
                query = query.eq(chave, valor);
            }
        });

        const { data, error } = await query;

        if (error) {
            console.error(`Erro ao buscar ${nomeTabela}:`, error.message);
            break;
        }

        if (!data || data.length === 0) break;

        todos = todos.concat(data);

        if (data.length < TAMANHO_PAGINA) break;
        inicio += TAMANHO_PAGINA;
    }

    return todos;
}

// ============================================================
// LEGISLATIVO (titulares + suplentes)
// ============================================================

/**
 * Busca titulares do Legislativo
 * @param {string} cargoFiltro - 'Deputado Federal' | 'Deputado Estadual' | 'Senador' | 'Governador' | null
 * @param {string} uf - opcional (ex: 'CE', 'SP')
 */
export async function buscarTitulares(cargoFiltro = null, uf = null) {
    try {
        const filtros = { ativo: true };
        if (cargoFiltro) filtros.cargo = cargoFiltro;
        if (uf) filtros.uf = uf;

        const lista = await buscarTodos('titulares', filtros);

        return lista.map((p) => ({
            id: p.id,
            nome: p.nome_urna || p.nome_completo || 'Sem nome',
            nome_completo: p.nome_completo,
            cargo: p.cargo,
            partido: p.partido || 'IND',
            uf: p.uf,
            numero_urna: p.numero_urna,
            espectro: p.espectro || 'Centro',
            foto_url: p.foto_url || '',
            status: p.status || 'eleito_agora',
            data_inicio: p.data_inicio,
            data_fim: p.data_fim,
        }));
    } catch (err) {
        console.error('Erro em buscarTitulares:', err);
        return [];
    }
}

/**
 * Busca suplentes de um titular específico (para a sanfona)
 */
export async function buscarSuplentesDoTitular(titularId) {
    try {
        const { data, error } = await supabase
            .from('suplentes')
            .select('*')
            .eq('titular_id', titularId)
            .eq('ativo', true)
            .order('tipo', { ascending: true });

        if (error) {
            console.error('Erro ao buscar suplentes:', error.message);
            return [];
        }

        return (data || []).map((s) => ({
            id: s.id,
            nome: s.nome_urna || s.nome_completo || 'Sem nome',
            nome_completo: s.nome_completo,
            tipo: s.tipo, // '1º Suplente' | '2º Suplente' | 'Vice-Governador'
            partido: s.partido || 'IND',
            uf: s.uf,
            espectro: s.espectro || 'Centro',
            foto_url: s.foto_url || '',
            status_eleitoral: s.status_eleitoral,
        }));
    } catch (err) {
        console.error('Erro em buscarSuplentesDoTitular:', err);
        return [];
    }
}

/**
 * Atalhos por cargo
 */
export async function buscarDeputadosFederais(uf = null) {
    return buscarTitulares('Deputado Federal', uf);
}

export async function buscarDeputadosEstaduais(uf = null) {
    return buscarTitulares('Deputado Estadual', uf);
}

export async function buscarSenadores(uf = null) {
    return buscarTitulares('Senador', uf);
}

export async function buscarGovernadores() {
    return buscarTitulares('Governador');
}

/**
 * Compatibilidade com código antigo que chamava buscarLegislativo('deputado')
 */
export async function buscarLegislativo(cargoFiltro) {
    const filtro = (cargoFiltro || '').toLowerCase();

    if (filtro.includes('deputado federal') || filtro === 'deputado') {
        return buscarDeputadosFederais();
    }
    if (filtro.includes('estadual') || filtro.includes('assembleia')) {
        return buscarDeputadosEstaduais();
    }
    if (filtro.includes('senador')) {
        return buscarSenadores();
    }
    if (filtro.includes('governador')) {
        return buscarGovernadores();
    }

    // Sem filtro → retorna todos os titulares
    return buscarTitulares();
}

// ============================================================
// EXECUTIVO FEDERAL (Presidente, Vice, Ministros)
// ============================================================

/**
 * Busca registros da tabela executivo
 * @param {string} esfera - 'federal' | 'estadual' | 'municipal' | null (todos)
 * @param {string|null} uf - obrigatório para estadual/municipal (ex: 'CE')
 */
export async function buscarExecutivo(esfera = 'federal', uf = null) {
    try {
        const filtros = { ativo: true };
        if (esfera) filtros.esfera = esfera;
        if (uf) filtros.uf = uf;

        const lista = await buscarTodos('executivo', filtros);

        return lista
            .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
            .map((item) => ({
                id: item.id,
                nome: item.nome,
                cargo: item.cargo,
                pasta: item.pasta,
                partido: item.partido || '',
                espectro: item.espectro || 'Centro',
                foto_url: item.foto_url || '',
                indicado_por: item.indicado_por,
                data_inicio: item.data_inicio,
                data_fim: item.data_fim,
                ordem: item.ordem || 0,
                esfera: item.esfera || 'federal',
                uf: item.uf || null,
            }));
    } catch (err) {
        console.error('Erro em buscarExecutivo:', err);
        return [];
    }
}

/**
 * Retorna só o Presidente (federal)
 */
export async function buscarPresidente() {
    const lista = await buscarExecutivo('federal');
    return lista.find((p) => p.cargo === 'Presidente') || null;
}

/**
 * Retorna só os Ministros (federal)
 */
export async function buscarMinistros() {
    const lista = await buscarExecutivo('federal');
    return lista.filter((p) => p.cargo === 'Ministro');
}

/**
 * Governador + secretários de um estado
 */
export async function buscarExecutivoEstadual(uf) {
    return buscarExecutivo('estadual', uf);
}

// ============================================================
// JUDICIÁRIO
// ============================================================

/**
 * Busca registros do Judiciário
 * @param {string} orgao - 'STF' | 'STJ' | 'TSE' | 'TST' | 'STM' | 'PF' | 'CGU' | 'AGU' | 'PGR' | null
 */
export async function buscarJudiciario(orgao = null) {
    try {
        const filtros = { ativo: true };
        if (orgao) filtros.orgao = orgao;

        const lista = await buscarTodos('judiciario', filtros);

        return lista
            .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
            .map((item) => ({
                id: item.id,
                nome: item.nome,
                orgao: item.orgao,
                cargo: item.cargo,
                partido: item.partido || '',
                espectro: item.espectro || '',
                foto_url: item.foto_url || '',
                indicado_por: item.indicado_por,
                data_inicio: item.data_inicio,
                data_fim: item.data_fim,
                turma: item.turma,
                origem: item.origem,
                patente: item.patente,
                forca: item.forca,
                ordem: item.ordem || 0,
            }));
    } catch (err) {
        console.error('Erro em buscarJudiciario:', err);
        return [];
    }
}

export async function buscarSTF() {
    return buscarJudiciario('STF');
}

export async function buscarSTJ() {
    return buscarJudiciario('STJ');
}

export async function buscarTSE() {
    return buscarJudiciario('TSE');
}

export async function buscarTST() {
    return buscarJudiciario('TST');
}

export async function buscarSTM() {
    return buscarJudiciario('STM');
}

export async function buscarOrgaosControle() {
    const orgaos = ['PF', 'CGU', 'AGU', 'PGR'];
    const resultados = await Promise.all(orgaos.map((o) => buscarJudiciario(o)));
    return resultados.flat();
}

// ============================================================
// CARGOS ESPECIAIS (Presidente da Casa, Líderes, etc.)
// ============================================================

export async function buscarCargosEspeciais(politicoTipo, politicoId) {
    try {
        const { data, error } = await supabase
            .from('cargos_especiais')
            .select('*')
            .eq('politico_tipo', politicoTipo)
            .eq('politico_id', politicoId)
            .eq('ativo', true);

        if (error) {
            console.error('Erro ao buscar cargos especiais:', error.message);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Erro em buscarCargosEspeciais:', err);
        return [];
    }
}

// ============================================================
// CONTADORES (para a Visão Geral)
// ============================================================

export async function contarTitularesPorCargo() {
    try {
        const lista = await buscarTitulares();
        return {
            deputadosFederais: lista.filter((p) => p.cargo === 'Deputado Federal').length,
            deputadosEstaduais: lista.filter((p) => p.cargo === 'Deputado Estadual').length,
            senadores: lista.filter((p) => p.cargo === 'Senador').length,
            governadores: lista.filter((p) => p.cargo === 'Governador').length,
            total: lista.length,
        };
    } catch (err) {
        return {
            deputadosFederais: 0,
            deputadosEstaduais: 0,
            senadores: 0,
            governadores: 0,
            total: 0,
        };
    }
}
