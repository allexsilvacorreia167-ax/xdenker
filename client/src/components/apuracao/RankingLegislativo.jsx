import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import DetalheInlineCandidato from './DetalheInlineCandidato';

const LABELS = {
  senador: 'Senador',
  deputado_federal: 'Deputado Federal',
  deputado_estadual: 'Deputado Estadual',
};

/**
 * Lista rankeada dos mais votados de um cargo legislativo, com busca por
 * nome/partido. Substitui o mapa na coluna central quando a aba ativa é
 * Senador, Dep. Federal ou Dep. Estadual.
 *
 * Comportamento diferente por breakpoint (mesmo padrão do resto do projeto):
 * - Desktop: lista simples — clicar só atualiza o painel de detalhes na
 *   coluna da direita (sem alterações).
 * - Mobile: sanfona — clicar expande os detalhes (votos, espectro,
 *   suplentes) embaixo da própria linha, empurrando as demais para baixo.
 */
export default function RankingLegislativo({
  cargo,
  uf,
  candidatos,
  onSelecionarCandidato,
  candidatoSelecionadoId,
}) {
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const lista = candidatos || [];
    const termo = busca.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter(
      (c) => c.name.toLowerCase().includes(termo) || c.party.toLowerCase().includes(termo)
    );
  }, [candidatos, busca]);

  const comRank = useMemo(() => filtrados.map((c, i) => ({ ...c, rank: i + 1 })), [filtrados]);

  const label = LABELS[cargo] || cargo;

  return (
    <div>
      <h2 className="text-center text-sm md:text-base font-bold text-slate-800 uppercase mb-3">
        {label}s mais votados {uf ? `(${uf})` : ''}
      </h2>

      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder={`Buscar candidato a ${label}...`}
          className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      {!uf ? (
        <p className="text-center text-sm text-slate-400 py-8">
          Escolha um estado abaixo para ver os candidatos.
        </p>
      ) : !comRank.length ? (
        <p className="text-center text-sm text-slate-400 py-8">
          Nenhum candidato encontrado para este recorte.
        </p>
      ) : (
        <>
          {/* ---------- MOBILE: sanfona ---------- */}
          <div className="md:hidden">
            <ListaSanfona candidatos={comRank} />
          </div>

          {/* ---------- DESKTOP: lista simples, sem alterações ---------- */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
            {comRank.map((c) => {
              const ativo = c.id === candidatoSelecionadoId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelecionarCandidato(c)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${ativo ? 'bg-slate-50' : 'hover:bg-slate-50'
                    }`}
                >
                  <span className="text-sm font-bold text-slate-400 w-5 text-center flex-shrink-0">
                    {c.rank}
                  </span>
                  {c.photo ? (
                    <img src={c.photo} alt={c.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold flex-shrink-0">
                      {c.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.party}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 flex-shrink-0">
                    {c.votes ? c.votes.toLocaleString('pt-BR') : `${c.percent?.toFixed(2)}%`}
                  </span>
                  <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
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
 * Lista sanfona (mobile) — um item aberto por vez, fecha ao clicar fora.
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
    <div ref={wrapRef} className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
      {candidatos.map((c) => {
        const aberto = c.id === abertoId;
        return (
          <div key={c.id}>
            <button
              type="button"
              onClick={() => setAbertoId(aberto ? null : c.id)}
              className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${aberto ? 'bg-slate-50' : ''
                }`}
            >
              <span className="text-sm font-bold text-slate-400 w-5 text-center flex-shrink-0">
                {c.rank}
              </span>
              {c.photo ? (
                <img src={c.photo} alt={c.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold flex-shrink-0">
                  {c.name?.charAt(0) || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                <p className="text-xs text-slate-500">{c.party}</p>
              </div>
              <span className="text-sm font-semibold text-slate-700 flex-shrink-0">
                {c.votes ? c.votes.toLocaleString('pt-BR') : `${c.percent?.toFixed(2)}%`}
              </span>
              <ChevronRight
                size={16}
                className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${aberto ? 'rotate-90' : ''
                  }`}
              />
            </button>

            {aberto && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200 px-3 pb-3">
                <DetalheInlineCandidato candidato={c} tipo="legislativo" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
