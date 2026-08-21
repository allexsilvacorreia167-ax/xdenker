import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export const resendConfigured = Boolean(resendApiKey);

const resend = resendConfigured ? new Resend(resendApiKey) : null;

/**
 * Envia o token de acesso por e-mail.
 * Em modo sandbox do Resend, só funciona para o e-mail cadastrado na conta.
 */
export async function sendTokenEmail({ to, fullName, token }) {
    if (!resendConfigured || !resend) {
        console.warn('[email] RESEND_API_KEY não configurada — e-mail não enviado');
        return { ok: false, error: 'Serviço de e-mail não configurado' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: emailFrom,
            to,
            subject: 'Seu token de acesso — XDENKER Pesquisa Eleitoral',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Olá, ${fullName?.split(' ')[0] || 'eleitor'}!</h2>
          <p style="color: #475569;">Use o token abaixo para acessar a pesquisa eleitoral XDENKER:</p>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 12px; text-align: center; margin: 24px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1e293b;">${token}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">Se você não solicitou este acesso, ignore este e-mail.</p>
        </div>
      `,
        });

        if (error) {
            console.error('[email] Resend error', error);
            return { ok: false, error: error.message };
        }

        return { ok: true, id: data?.id };
    } catch (e) {
        console.error('[email] send failed', e);
        return { ok: false, error: e.message };
    }
}

export default { sendTokenEmail, resendConfigured };