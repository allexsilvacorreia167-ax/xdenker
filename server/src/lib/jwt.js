import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

if (!JWT_SECRET) {
    console.warn('[jwt] JWT_SECRET não definido — tokens não podem ser gerados/validados com segurança');
}

/**
 * Gera um JWT para sessão de usuário comum.
 */
export function signUserToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, subject: String(payload.id) });
}

/**
 * Gera um JWT para sessão de administrador (claim diferenciado).
 */
export function signAdminToken(payload) {
    return jwt.sign({ ...payload, role: 'admin' }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        subject: String(payload.id),
    });
}

/**
 * Verifica e decodifica um JWT. Lança erro se inválido/expirado.
 */
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

export default { signUserToken, signAdminToken, verifyToken };