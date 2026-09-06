/**
 * Painel lateral direito (desktop) — card de detalhes do candidato
 * selecionado (via painel esquerdo, ranking legislativo, ou futuramente
 * a busca global).
 *
 * Campos como "vice" e "suplentes" dependem de dado real do TSE que ainda
 * não foi integrado (fase mock) — em vez de inventar nomes fictícios
 * (arriscado num produto de informação eleitoral), mostramos claramente
 * que a informação ainda não está disponível.
 */
export default function DetalhesCandidato({ candidato, cargo, uf }) {
  if (!candidato) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
        <p className="text-xs text-slate-400">
          Selecione um candidato para ver os detalhes oficiais.
        </p>
      </div>
    );
  }

  const ehExecutivo = cargo === 'presidente' || cargo === 'governador';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex flex-col items-center text-center mb-4">
        {candidato.photo ? (
          <img
            src={candidato.photo}
            alt={candidato.name}
            className="w-20 h-20 rounded-full object-cover mb-2"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-2xl font-bold mb-2">
            {candidato.name?.charAt(0) || '?'}
          </div>
        )}
        <p className="text-sm font-bold text-slate-800">{candidato.name}</p>
        <p className="text-xs text-slate-500">
          {candidato.party}
          {candidato.number ? ` · nº ${candidato.number}` : ''}
        </p>
        <p className="text-lg font-bold mt-1" style={{ color: candidato.color }}>
          {candidato.percent?.toFixed(2)}%
        </p>
      </div>

      <dl className="space-y-2 text-xs">
        {cargo === 'governador' && uf && (
          <Campo label="Estado" valor={uf} />
        )}
        {candidato.votes && (
          <Campo label="Votos" valor={candidato.votes.toLocaleString('pt-BR')} />
        )}
        <Campo label="Espectro" valor={candidato.spectrum} />

        {ehExecutivo && (
          <Campo label="Vice" valor={null} indisponivel />
        )}
        {!ehExecutivo && (
          <Campo label="Suplentes" valor={null} indisponivel />
        )}
      </dl>
    </div>
  );
}

function Campo({ label, valor, indisponivel }) {
  return (
    <div className="flex justify-between border-b border-slate-50 pb-1.5">
      <dt className="text-slate-400">{label}</dt>
      <dd className={indisponivel ? 'text-slate-300 italic' : 'font-semibold text-slate-700'}>
        {indisponivel ? 'Não disponível ainda' : valor}
      </dd>
    </div>
  );
}
