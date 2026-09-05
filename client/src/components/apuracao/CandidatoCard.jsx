/**
 * Card de candidato — usado no resumo da Home e na página completa de Apuração.
 * Anel de percentual (SVG) + foto (ou inicial) + nome + partido + número.
 * A cor do anel já vem resolvida do backend (espectro político do partido).
 *
 * Tamanho responsivo via classes Tailwind (w-12/h-12 no mobile, w-20/h-20
 * no desktop) — o SVG usa viewBox fixo (0 0 100 100), então escala junto
 * com o container sem precisar recalcular nada em JS.
 */
export default function CandidatoCard({ candidato }) {
  if (!candidato) return null;

  const { name, party, number, percent = 0, color = '#94a3b8', photo } = candidato;

  const raio = 42;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia - (Math.min(percent, 100) / 100) * circunferencia;

  return (
    <div className="flex flex-col items-center text-center gap-1 min-w-[52px] md:min-w-[72px]">
      <div className="relative w-12 h-12 md:w-20 md:h-20">
        <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
          <circle cx="50" cy="50" r={raio} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={raio}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circunferencia}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="w-[76%] h-[76%] rounded-full object-cover"
            />
          ) : (
            <div className="w-[76%] h-[76%] rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-[9px] md:text-xs font-bold">
              {name?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <span
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] md:text-[10px] font-bold text-white px-1 md:px-1.5 py-[1px] md:py-0.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: color }}
        >
          {percent.toFixed(0)}%
        </span>
      </div>
      <div>
        <p className="text-[9px] md:text-xs font-bold text-slate-800 leading-tight line-clamp-1 max-w-[64px] md:max-w-none">
          {name}
        </p>
        <p className="text-[7px] md:text-[10px] text-slate-500 leading-tight">
          {party}
          {number ? ` · ${number}` : ''}
        </p>
      </div>
    </div>
  );
}
