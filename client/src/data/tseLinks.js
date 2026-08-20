/**
 * Links diretos para a página de candidatos do TSE (DivulgaCandContas)
 * Padrão confirmado: /divulga/#/candidato/{REGIÃO}/{UF}/20322002026
 * Só muda a região e a sigla da UF — o código da eleição é fixo.
 */

const ELECTION_CODE = '20322002026';

const REGION_BY_UF = {
    // Norte
    AC: 'NORTE',
    AP: 'NORTE',
    AM: 'NORTE',
    PA: 'NORTE',
    RO: 'NORTE',
    RR: 'NORTE',
    TO: 'NORTE',

    // Nordeste
    AL: 'NORDESTE',
    BA: 'NORDESTE',
    CE: 'NORDESTE',
    MA: 'NORDESTE',
    PB: 'NORDESTE',
    PE: 'NORDESTE',
    PI: 'NORDESTE',
    RN: 'NORDESTE',
    SE: 'NORDESTE',

    // Centro-Oeste
    DF: 'CENTRO-OESTE',
    GO: 'CENTRO-OESTE',
    MS: 'CENTRO-OESTE',
    MT: 'CENTRO-OESTE',

    // Sudeste
    ES: 'SUDESTE',
    MG: 'SUDESTE',
    RJ: 'SUDESTE',
    SP: 'SUDESTE',

    // Sul
    PR: 'SUL',
    RS: 'SUL',
    SC: 'SUL',
};

/**
 * Monta o link do TSE para a UF informada.
 * @param {string} uf - sigla da UF (ex: 'CE', 'SP')
 * @returns {string|null} URL completa, ou null se a UF não for reconhecida
 */
export function getTseLink(uf) {
    if (!uf) return null;
    const normalizedUF = uf.toString().toUpperCase().slice(0, 2);
    const region = REGION_BY_UF[normalizedUF];
    if (!region) return null;
    return `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/${region}/${normalizedUF}/${ELECTION_CODE}`;
}

export default { getTseLink, REGION_BY_UF };