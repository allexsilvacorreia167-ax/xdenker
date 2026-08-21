/**
 * Detecta erros comuns de domínio de e-mail e sugere correção.
 * Cobre os provedores brasileiros mais usados + erros de digitação comuns.
 */

const KNOWN_DOMAINS = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'yahoo.com.br',
    'icloud.com',
    'live.com',
    'bol.com.br',
    'uol.com.br',
    'terra.com.br',
    'ig.com.br',
];

// Mapeia erros comuns direto para o domínio correto (mais confiável que distância de string)
const COMMON_TYPOS = {
    'gmail.com.br': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gnail.com': 'gmail.com',
    'hotmail.com.br': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outlook.com.br': 'outlook.com',
    'outlok.com': 'outlook.com',
    'yahoo.com.br.com': 'yahoo.com.br',
    'yaho.com': 'yahoo.com',
    'icloud.com.br': 'icloud.com',
    'live.com.br': 'live.com',
};

/**
 * Distância de edição simples (Levenshtein) para pegar erros de digitação
 * que não estão no mapa de typos comuns.
 */
function levenshtein(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
        Array(b.length + 1).fill(0).map((_, j) => (i === 0 ? j : 0))
    );
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }
    return dp[a.length][b.length];
}

/**
 * Retorna uma sugestão de e-mail corrigido, ou null se não houver problema detectável.
 * @param {string} email
 * @returns {string|null}
 */
export function suggestEmailCorrection(email) {
    if (!email || !email.includes('@')) return null;

    const [localPart, domain] = email.toLowerCase().trim().split('@');
    if (!domain || !localPart) return null;

    // 1) Checa o mapa de erros comuns primeiro (mais preciso)
    if (COMMON_TYPOS[domain]) {
        return `${localPart}@${COMMON_TYPOS[domain]}`;
    }

    // Se já é um domínio conhecido e correto, não sugere nada
    if (KNOWN_DOMAINS.includes(domain)) return null;

    // 2) Fallback: distância de edição contra domínios conhecidos
    let closest = null;
    let minDistance = Infinity;

    for (const known of KNOWN_DOMAINS) {
        const dist = levenshtein(domain, known);
        // Só sugere se a diferença for pequena (1-2 caracteres) — evita sugestões absurdas
        if (dist <= 2 && dist < minDistance) {
            minDistance = dist;
            closest = known;
        }
    }

    if (closest && minDistance > 0) {
        return `${localPart}@${closest}`;
    }

    return null;
}