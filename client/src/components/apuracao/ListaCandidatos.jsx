/**
 * Lista completa de candidatos com barra de percentual.
 * Usada para Presidente/Governador (todos os candidatos) e para os
 * eleitos do Legislativo (Senador/Dep. Federal/Dep. Estadual).
 */
export default function ListaCandidatos({ candidatos, mostrarVotos = true }) {
  if (!candidatos?.length) {
    return (
      <p className="text-sm text-slate-400 text-center py-6">
        Nenhum candidato disponível para este recorte.
      </p>
    );
  }

  return (
    <div className="space-y-2 md:space-y-3">
      {candidatos.map((c) => (
        <div
          key={c.id}
          className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 p-2.5 md:p-3"
        >
          {c.photo ? (
            <img
              src={c.photo}
              alt={c.name}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs md:text-sm font-bold flex-shrink-0">
              {c.name?.charAt(0) || '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs md:text-sm font-semibold text-slate-800 truncate">{c.name}</p>
              <span className="text-xs md:text-sm font-bold flex-shrink-0" style={{ color: c.color }}>
                {c.percent?.toFixed(2)}%
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-slate-500">
              {c.party}
              {c.number ? ` · ${c.number}` : ''}
              {mostrarVotos && c.votes ? ` · ${c.votes.toLocaleString('pt-BR')} votos` : ''}
            </p>
            <div className="h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(c.percent || 0, 100)}%`, backgroundColor: c.color }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
