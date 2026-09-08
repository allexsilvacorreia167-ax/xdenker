// src/components/Hemiciclo.tsx
// Hemiciclo em formato U com bolinhas coloridas por espectro
import { useMemo, useState } from "react";

const CORES: Record<string, string> = {
  Esquerda: "#C0392B",
  "Centro-Esquerda": "#E67E22",
  Centro: "#F1C40F",
  "Centro-Direita": "#52BE80",
  Direita: "#1E8449",
};

type Politico = {
  id: string | number;
  nome?: string;
  nome_urna?: string;
  partido?: string;
  uf?: string;
  espectro?: string;
  ehPresidenteCasa?: boolean;
};

type Props = {
  politicos: Politico[];
  /** IDs para destacar (filtro por nome/espectro/UF) */
  destaqueIds?: (string | number)[];
  /** Quantidade máxima de arcos (linhas do U) */
  maxArcos?: number;
  label?: string;
  totalLabel?: string;
  onSelect?: (p: Politico) => void;
  height?: number;
};

/**
 * Distribui N pontos em arcos concêntricos (formato de U / meia-lua).
 */
function layoutU(n: number, maxArcos = 8) {
  if (n <= 0) return [] as { x: number; y: number; r: number }[];

  // Quantidade aproximada por arco (cresce do centro para fora)
  const arcos: number[] = [];
  let restante = n;
  let base = Math.max(3, Math.ceil(n / (maxArcos * 1.2)));

  for (let a = 0; a < maxArcos && restante > 0; a++) {
    const qtd = Math.min(restante, base + a * 2);
    arcos.push(qtd);
    restante -= qtd;
  }
  if (restante > 0) arcos[arcos.length - 1] += restante;

  const pontos: { x: number; y: number; r: number }[] = [];
  const cx = 50;
  const cy = 58; // centro do U um pouco abaixo
  const raioMin = 18;
  const raioMax = 46;
  const angInicio = Math.PI; // 180° (esquerda)
  const angFim = 0; // 0° (direita) → arco superior

  arcos.forEach((qtd, i) => {
    const t = arcos.length === 1 ? 0 : i / (arcos.length - 1);
    const raio = raioMin + t * (raioMax - raioMin);
    for (let j = 0; j < qtd; j++) {
      const frac = qtd === 1 ? 0.5 : j / (qtd - 1);
      const ang = angInicio + frac * (angFim - angInicio);
      const x = cx + raio * Math.cos(ang);
      const y = cy - raio * Math.sin(ang); // y invertido no SVG lógico
      pontos.push({ x, y, r: 1.15 });
    }
  });

  return pontos;
}

export default function Hemiciclo({
  politicos,
  destaqueIds = [],
  maxArcos = 9,
  label = "Hemiciclo",
  totalLabel,
  onSelect,
  height = 220,
}: Props) {
  const [hoverId, setHoverId] = useState<string | number | null>(null);

  // Ordena: esquerda → direita no arco (por espectro)
  const ordemEspectro = [
    "Esquerda",
    "Centro-Esquerda",
    "Centro",
    "Centro-Direita",
    "Direita",
  ];

  const ordenados = useMemo(() => {
    return [...politicos].sort((a, b) => {
      if (a.ehPresidenteCasa) return 1;
      if (b.ehPresidenteCasa) return -1;
      const ia = ordemEspectro.indexOf(a.espectro || "Centro");
      const ib = ordemEspectro.indexOf(b.espectro || "Centro");
      return (ia < 0 ? 2 : ia) - (ib < 0 ? 2 : ib);
    });
  }, [politicos]);

  const presidente = ordenados.find((p) => p.ehPresidenteCasa);
  const membros = ordenados.filter((p) => !p.ehPresidenteCasa);
  const posicoes = useMemo(
    () => layoutU(membros.length, maxArcos),
    [membros.length, maxArcos]
  );

  const temDestaque = destaqueIds.length > 0;
  const setDestaque = new Set(destaqueIds.map(String));

  const nome = (p: Politico) => p.nome || p.nome_urna || "—";

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 100 72"
        className="w-full"
        style={{ height }}
        role="img"
        aria-label={label}
      >
        {/* Arco guia suave */}
        <path
          d="M 8 58 A 42 42 0 0 1 92 58"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="0.3"
        />

        {/* Bolinhas dos membros */}
        {membros.map((p, i) => {
          const pos = posicoes[i];
          if (!pos) return null;
          const cor = CORES[p.espectro || "Centro"] || "#94a3b8";
          const id = p.id;
          const destacado = temDestaque && setDestaque.has(String(id));
          const apagado = temDestaque && !destacado;
          const hover = hoverId === id;
          const r = destacado || hover ? pos.r * 1.55 : pos.r;

          return (
            <g key={String(id)}>
              {(destacado || hover) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r + 0.9}
                  fill="none"
                  stroke={cor}
                  strokeWidth="0.45"
                  opacity="0.9"
                />
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r}
                fill={cor}
                opacity={apagado ? 0.18 : 1}
                style={{ cursor: onSelect ? "pointer" : "default" }}
                onMouseEnter={() => setHoverId(id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => onSelect?.(p)}
              >
                <title>
                  {nome(p)}
                  {p.partido ? ` • ${p.partido}` : ""}
                  {p.uf ? ` • ${p.uf}` : ""}
                  {p.espectro ? ` • ${p.espectro}` : ""}
                </title>
              </circle>
            </g>
          );
        })}

        {/* Presidente da Casa — bolinha maior no centro do U */}
        {presidente && (
          <g>
            <circle
              cx="50"
              cy="62"
              r="3.2"
              fill="none"
              stroke={CORES[presidente.espectro || "Centro"] || "#334155"}
              strokeWidth="0.5"
            />
            <circle
              cx="50"
              cy="62"
              r="2.4"
              fill={CORES[presidente.espectro || "Centro"] || "#334155"}
              style={{ cursor: onSelect ? "pointer" : "default" }}
              onClick={() => onSelect?.(presidente)}
              onMouseEnter={() => setHoverId(presidente.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <title>
                {nome(presidente)} (Presidente da Casa)
                {presidente.partido ? ` • ${presidente.partido}` : ""}
              </title>
            </circle>
          </g>
        )}

        {/* Número total no centro */}
        <text
          x="50"
          y={presidente ? "48" : "52"}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="5"
          fontWeight="700"
        >
          {totalLabel || politicos.length}
        </text>
        <text
          x="50"
          y={presidente ? "53" : "57"}
          textAnchor="middle"
          fill="#cbd5e1"
          fontSize="2.2"
        >
          {label}
        </text>
      </svg>

      {/* Tooltip simples no mobile / legenda hover */}
      {hoverId != null && (
        <div className="text-center text-xs text-slate-600 -mt-1 mb-1">
          {(() => {
            const p = ordenados.find((x) => x.id === hoverId);
            if (!p) return null;
            return (
              <span>
                <strong>{nome(p)}</strong>
                {p.partido ? ` · ${p.partido}` : ""}
                {p.uf ? ` · ${p.uf}` : ""}
                {p.ehPresidenteCasa ? " · Presidente da Casa" : ""}
              </span>
            );
          })()}
        </div>
      )}
    </div>
  );
}
