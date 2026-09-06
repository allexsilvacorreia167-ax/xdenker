import { useState, useMemo } from 'react';
import { ChevronRight, Search } from 'lucide-react';

const LABELS = {
  senador: 'Senador',
  deputado_federal: 'Deputado Federal',
  deputado_estadual: 'Deputado Estadual',
};

/**
 * Lista rankeada dos mais votados de um cargo legislativo, com busca por
 * nome/partido. Substitui o mapa na coluna central quando a aba ativa é
 * Senador, Dep. Federal ou Dep. Estadual (o mapa não faz sentido para
 * esses cargos — são vários candidatos por estado, não um por região).
 */
export default function RankingLegislativo({ cargo, uf, candidatos, onSelecionarCandidato, candidatoSelecionadoId }) {
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const lista = candidatos || [];
    const termo = busca.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter(
      (c) => c.name.toLowerCase().includes(termo) || c.party.toLowerCase().includes(termo)
    );
  }, [candidatos, busca]);

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
      ) : !filtrados.length ? (
        <p className="text-center text-sm text-slate-400 py-8">
          Nenhum candidato encontrado para este recorte.
        </p>
      ) : (
        <div className="space-y-3">
          {/* DESTAQUE NO TOPO (Apenas no mobile quando houver um candidato selecionado) */}
          {(() => {
            const candidatoSelecionado = filtrados.find((c) => c.id === candidatoSelecionadoId);
            if (!candidatoSelecionado) return null;
            return (
              <div className="md:hidden bg-white rounded-2xl border-2 border-slate-800 p-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white px-2 py-0.5 rounded-full">
                    Selecionado
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelecionarCandidato(null)}
                    className="text-xs text-slate-500 font-bold hover:text-slate-800"
                  >
                    ✕ Fechar / Voltar lista
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  {candidatoSelecionado.photo ? (
                    <img src={candidatoSelecionado.photo} alt={candidatoSelecionado.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-base flex-shrink-0">
                      {candidatoSelecionado.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{candidatoSelecionado.name}</p>
                    <p className="text-xs text-slate-500">{candidatoSelecionado.party} • {candidatoSelecionado.number || 'N/A'}</p>
                  </div>
                  <span className="text-sm font-extrabold text-slate-800">
                    {candidatoSelecionado.votes ? candidatoSelecionado.votes.toLocaleString('pt-BR') : `${candidatoSelecionado.percent?.toFixed(2)}%`}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">Espectro:</span>
                    <span className="font-semibold text-slate-700">{candidatoSelecionado.spectrum || 'Não definido'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 pt-1">
                    <span className="font-medium text-slate-400">Suplentes:</span>
                    <span className="font-semibold text-slate-800">
                      {candidatoSelecionado.suplentes?.length ? candidatoSelecionado.suplentes.join(', ') : 'Aguardando definição de suplentes'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* LISTA REGULAR LOGO ABAIXO */}
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
            {filtrados
              .filter((c) => c.id !== candidatoSelecionadoId)
              .map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelecionarCandidato(c)}
                  className="w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="text-sm font-bold text-slate-400 w-5 text-center flex-shrink-0">
                    {i + 1}
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
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
