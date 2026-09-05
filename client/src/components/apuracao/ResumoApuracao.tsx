import { ArrowLeft, ExternalLink } from 'lucide-react';
import useResumoApuracao from '../../hooks/useResumoApuracao';
import CandidatoCard from './CandidatoCard';

/**
 * Substitui o banner na Home quando o usuário clica em
 * "Ver apuração em tempo real". Mostra Presidente + Governador
 * (regra dos 3 candidatos já resolvida dentro de useResumoApuracao).
 *
 * `painel` vem de usePainelApuracao (ver hooks/usePainelApuracao.js),
 * já com { uf, presidenteId, governadorId, origem }.
 */
export default function ResumoApuracao({ painel, onVoltar, onVerCompleta }) {
  const { presidente, governador, loading, erro } = useResumoApuracao(painel);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 md:p-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para o banner
        </button>
        <button
          type="button"
          onClick={onVerCompleta}
          className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
        >
          Ver completa
          <ExternalLink size={14} />
        </button>
      </div>

      <h2 className="text-center text-xs md:text-sm font-bold tracking-wide text-slate-800 uppercase mb-4">
        Apuração em tempo real — Eleições 2026
      </h2>

      {loading && !presidente ? (
        <p className="text-center text-sm text-slate-400 py-6">Carregando apuração...</p>
      ) : erro ? (
        <p className="text-center text-sm text-red-500 py-6">{erro}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          <div>
            <p className="text-center text-[11px] font-bold uppercase text-slate-500 mb-3">
              Presidente (Brasil)
            </p>
            <div className="flex justify-center gap-2 md:gap-4">
              {(presidente?.exibidos || []).map((c) => (
                <CandidatoCard key={c.id} candidato={c} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-center text-[11px] font-bold uppercase text-slate-500 mb-3">
              Governador {painel.uf ? `(${painel.uf})` : ''}
            </p>
            {governador ? (
              <div className="flex justify-center gap-2 md:gap-4">
                {(governador?.exibidos || []).map((c) => (
                  <CandidatoCard key={c.id} candidato={c} />
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-slate-400 mt-2 px-2">
                Escolha um estado no mapa abaixo para ver o Governador.
              </p>
            )}
          </div>
        </div>
      )}

      {presidente?.urnasApuradas !== undefined && (
        <div className="mt-5">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Urnas apuradas</span>
            <span>{presidente.urnasApuradas}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all"
              style={{ width: `${presidente.urnasApuradas}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
