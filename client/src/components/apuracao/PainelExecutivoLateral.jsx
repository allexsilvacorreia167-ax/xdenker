import { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import DetalheInlineCandidato from './DetalheInlineCandidato';

/**
 * Painel lateral esquerdo — "Apuração Nacional/Estadual".
 * Sempre mostra Presidente e Governador, independente da aba ativa no topo.
 *
 * Comportamento diferente por breakpoint (CSS puro, mesmo padrão já usado
 * em outros componentes do projeto — sem hook de media query):
 * - Desktop: lista simples. Clicar num candidato troca a aba ativa e
 *   seleciona esse candidato para o painel de detalhes à direita
 *   (sem alterações aqui).
 * - Mobile: sanfona (accordion). Clicar num candidato expande os detalhes
 *   dele embaixo da própria linha, empurrando as demais para baixo — não
 *   depende mais de um painel de detalhes separado lá embaixo da página.
 */
export default function PainelExecutivoLateral({
  presidente,
  governador,
  uf,
  candidatoSelecionadoId,
  onSelecionarCandidato,
}) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wide">
        Apuração Nacional/Estadual
      </p>

      <CardCargo
        titulo="Presidente"
        candidatos={presidente?.candidates}
        candidatoSelecionadoId={candidatoSelecionadoId}
        onSelecionar={(c) => onSelecionarCandidato('presidente', c)}
      />

      <CardCargo
        titulo={`Governador${uf ? ` (${uf})` : ''}`}
        candidatos={governador?.candidates}
        candidatoSelecionadoId={candidatoSelecionadoId}
        onSelecionar={(c) => onSelecionarCandidato('governador', c)}
        vazio={!uf ? 'Escolha um estado para ver o Governador.' : null}
      />
    </div>
  );
}

function CardCargo({ titulo, candidatos, candidatoSelecionadoId, onSelecionar, vazio }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <p className="text-xs font-bold uppercase text-slate-700 mb-3">{titulo}</p>

      {vazio ? (
        <p className="text-xs text-slate-400">{vazio}</p>
      ) : !candidatos?.length ? (
        <p className="text-xs text-slate-400">Sem candidatos cadastrados ainda.</p>
      ) : (
        <>
          {/* ---------- MOBILE: sanfona ---------- */}
          <div className="md:hidden">
            <ListaSanfona candidatos={candidatos} />
          </div>

          {/* ---------- DESKTOP: lista simples, sem alterações ---------- */}
          <div className="hidden md:block space-y-3">
            {candidatos.map((c) => {
              const ativo = c.id === candidatoSelecionadoId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelecionar(c)}
                  className={`w-full text-left rounded-lg transition-colors ${ativo ? 'bg-slate-50 -mx-2 px-2 py-1' : ''
                    }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-800 truncate pr-2">
                      {c.name}
                    </span>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: c.color }}>
                      {c.percent?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(c.percent || 0, 100)}%`, backgroundColor: c.color }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Lista sanfona (mobile) — um item aberto por vez. Clicar num item aberto
 * fecha; clicar em outro fecha o anterior e abre o novo; clicar fora
 * fecha tudo.
 */
function ListaSanfona({ candidatos }) {
  const [abertoId, setAbertoId] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const aoClicarFora = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setAbertoId(null);
    };
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, []);

  return (
    <div ref={wrapRef} className="space-y-2">
      {candidatos.map((c) => {
        const aberto = c.id === abertoId;
        return (
          <div key={c.id} className="rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setAbertoId(aberto ? null : c.id)}
              className={`w-full text-left rounded-lg transition-colors ${aberto ? 'bg-slate-50 px-2 py-1.5' : ''
                }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-800 truncate pr-2">
                      {c.name}
                    </span>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: c.color }}>
                      {c.percent?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(c.percent || 0, 100)}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${aberto ? 'rotate-90' : ''
                    }`}
                />
              </div>
            </button>

            {aberto && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200 pt-2">
                <DetalheInlineCandidato candidato={c} tipo="executivo" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
