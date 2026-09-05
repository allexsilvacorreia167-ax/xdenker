/**
 * Card de candidato — usado no resumo da Home e na página completa de Apuração.
 * Anel de percentual (SVG) + foto (ou inicial) + nome + partido + número.
 * A cor do anel já vem resolvida do backend (espectro político do partido).
 */
export default function CandidatoCard({ candidato, tamanho = 72 }) {
  if (!candidato) return null;

  const { name, party, number, percent = 0, color = '#94a3b8', photo } = candidato;

  const raio = tamanho / 2 - 4;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia - (Math.min(percent, 100) / 100) * circunferencia;

  return (
    <div className="flex flex-col items-center text-center gap-1.5 min-w-[72px]">
      <div className="relative" style={{ width: tamanho, height: tamanho }}>
        <svg width={tamanho} height={tamanho} className="-rotate-90">
          <circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raio}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={4}
          />
          <circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raio}
            fill="none"
            stroke={color}
            strokeWidth={4}
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
              className="w-[78%] h-[78%] rounded-full object-cover"
            />
          ) : (
            <div className="w-[78%] h-[78%] rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">
              {name?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <span
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: color }}
        >
          {percent.toFixed(0)}%
        </span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-800 leading-tight">{name}</p>
        <p className="text-[10px] text-slate-500 leading-tight">
          {party}
          {number ? ` · ${number}` : ''}
        </p>
      </div>
    </div>
  );
}
