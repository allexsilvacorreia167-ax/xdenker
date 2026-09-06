import { useState, useMemo } from 'react';
import { ChevronRight, Search, X } from 'lucide-react';

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
 * Comportamento diferente por breakpoint (CSS puro, sem hook de media
 * query — mesmo padrão já usado no resto do projeto):
 * - Desktop: lista simples, sem alterações. Clicar num candidato só
 *   atualiza o painel de detalhes na coluna da direita.
 * - Mobile: clicar (ou selecionar via busca) expande o candidato num
 *   card "dinâmico" no topo, com botão de fechar (✕) que limpa a seleção
 *   e volta à lista padrão. O candidato selecionado some da lista de
 *   baixo, sem duplicar.
 */
export default function RankingLegislativo({
  cargo,
  uf,
  candidatos,
  onSelecionarCandidato,
  candidatoSelecionadoId,
}) {
  const [busca, setBusca] = useState('');
  const [selecionadoMobile, setSelecionadoMobile] = useState(null);

  const filtrados = useMemo(() => {
    const lista = candidatos || [];
    const termo = busca.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter(
      (c) => c.name.toLowerCase().includes(termo) || c.party.toLowerCase().includes(termo)
    );
  }, [candidatos, busca]);

  // Mantém o número de rank original mesmo depois de remover o selecionado
  const comRank = useMemo(() => filtrados.map((c, i) => ({ ...c, rank: i + 1 })), [filtrados]);

  const label = LABELS[cargo] || cargo;

  const handleSelecionarMobile = (c) => {
    setSelecionadoMobile(c);
    onSelecionarCandidato?.(c);
  };

  const handleFecharMobile = () => {
    setSelecionadoMobile(null);
    onSelecionarCandidato?.(null);
  };

  const restantesMobile = selecionadoMobile
    ? comRank.filter((c) => c.id !== selecionadoMobile.id)
    : comRank;

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
          {/* ---------- MOBILE: slot dinâmico no topo ---------- */}
          <div className="md:hidden space-y-3">
            {selecionadoMobile && (
              <CardExpandido candidato={selecionadoMobile} onFechar={handleFecharMobile} />
            )}
            <ListaSimples candidatos={restantesMobile} onSelecionar={handleSelecionarMobile} />
          </div>

          {/* ---------- DESKTOP: lista simples, sem alterações ---------- */}
          <div className="hidden md:block">
            <ListaSimples
              candidatos={comRank}
              onSelecionar={onSelecionarCandidato}
              candidatoSelecionadoId={candidatoSelecionadoId}
            />
          </div>
        </>
      )}
    </div>
  );
}

function ListaSimples({ candidatos, onSelecionar, candidatoSelecionadoId }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
      {candidatos.map((c) => {
        const ativo = c.id === candidatoSelecionadoId;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelecionar(c)}
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
  );
}

/**
 * Card expandido do candidato selecionado (mobile) — substitui a antiga
 * navegação para um painel separado. Suplentes reais dependem de dado do
 * TSE ainda não integrado; mostramos isso claramente em vez de inventar.
 */
function CardExpandido({ candidato, onFechar }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-800 p-4 relative">
      <button
        type="button"
        onClick={onFechar}
        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
        aria-label="Fechar"
      >
        <X size={14} />
      </button>

      <div className="flex flex-col items-center text-center">
        {candidato.photo ? (
          <img
            src={candidato.photo}
            alt={candidato.name}
            className="w-16 h-16 rounded-full object-cover mb-2"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-xl font-bold mb-2">
            {candidato.name?.charAt(0) || '?'}
          </div>
        )}
        <p className="text-sm font-bold text-slate-800">{candidato.name}</p>
        <p className="text-xs text-slate-500 mb-2">
          {candidato.party}
          {candidato.number ? ` · nº ${candidato.number}` : ''}
        </p>
      </div>

      <dl className="space-y-1.5 text-xs mt-2">
        {candidato.votes && (
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <dt className="text-slate-400">Votos</dt>
            <dd className="font-semibold text-slate-700">
              {candidato.votes.toLocaleString('pt-BR')}
            </dd>
          </div>
        )}
        <div className="flex justify-between border-b border-slate-50 pb-1.5">
          <dt className="text-slate-400">Espectro</dt>
          <dd className="font-semibold text-slate-700">{candidato.spectrum}</dd>
        </div>
        <div className="flex justify-between pb-1.5">
          <dt className="text-slate-400">Suplentes</dt>
          <dd className="text-slate-300 italic">Não disponível ainda</dd>
        </div>
      </dl>
    </div>
  );
}
