import { apiFetch } from '../api';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { X, Lock } from 'lucide-react';
import { suggestEmailCorrection } from '../utils/emailSuggestion';

export default function LoginModal({ step, setStep, credentials, setCredentials, onClose }) {
  const { login } = useAuth();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSuggestion, setEmailSuggestion] = useState(null);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setCredentials((prev) => ({ ...prev, email: value }));
    setEmailSuggestion(suggestEmailCorrection(value));
  };

  const applyEmailSuggestion = () => {
    setCredentials((prev) => ({ ...prev, email: emailSuggestion }));
    setEmailSuggestion(null);
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro no login');

      setStep('token');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          token: token.toUpperCase(),
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Token inválido');

      login(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <div className="p-6 pt-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <Lock className="text-blue-600" size={28} />
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 text-center mb-1">
            Acesse a Pesquisa
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            Informe seus dados para participar
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={credentials.fullName}
                  onChange={(e) =>
                    setCredentials((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={credentials.email}
                  onChange={handleEmailChange}
                />
                {emailSuggestion && (
                  <button
                    type="button"
                    onClick={applyEmailSuggestion}
                    className="mt-1.5 text-xs text-blue-600 hover:text-blue-800 text-left"
                  >
                    Você quis dizer <strong>{emailSuggestion}</strong>? Toque para corrigir
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Gerando token...' : 'Continuar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Token de Acesso
                </label>
                <input
                  type="text"
                  required
                  placeholder="TKN-XXXX-XXXX"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 font-mono tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  O token foi enviado para seu e-mail
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Validando...' : '→ Entrar na Pesquisa'}
              </button>
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="w-full text-sm text-slate-500 hover:text-slate-700 py-1"
              >
                ← Voltar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}