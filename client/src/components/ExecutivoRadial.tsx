// src/components/ExecutivoRadial.tsx
// Diagrama radial: Presidente no centro + ministérios em coroa (360°)
import { useMemo, useState } from "react";

const CORES: Record<string, string> = {
  Esquerda: "#C0392B",
  "Centro-Esquerda": "#E67E22",
  Centro: "#F1C40F",
  "Centro-Direita": "#52BE80",
  Direita: "#1E8449",
};

type Item = {
  id?: string | number;
  nome?: string;
  pasta?: string;
  partido?: string;
  espectro?: string;
  cargo?: string;
};

type Props = {
  presidente: Item | null;
  ministros: Item[];
  height?: number;
  onSelectMinistro?: (m: Item) => void;
};

/** Distribui N pontos em 1 ou 2 anéis para evitar sobreposição */
function layoutAnel(n: number, raioInterno: number, raioExterno: number) {
  if (n <= 0) return [] as { x: number; y: number; anel: number }[];
  const pontos: { x: number; y: number; anel: number }[] = [];

  // Até 18 no anel interno; o resto no externo
  const noInterno = Math.min(n, n <= 18 ? n : Math.ceil(n * 0.55));
  const noExterno = n - noInterno;

  const colocar = (qtd: number, raio: number, anel: number, offset = 0) => {
    for (let i = 0; i < qtd; i++) {
      const ang = -Math.PI / 2 + offset + (i / qtd) * 2 * Math.PI;
      pontos.push({
        x: 50 + raio * Math.cos(ang),
        y: 50 + raio * Math.sin(ang),
        anel,
      });
    }
  };

  if (noExterno === 0) {
    colocar(noInterno, (raioInterno + raioExterno) / 2, 0, 0);
  } else {
    colocar(noInterno, raioInterno, 0, 0);
    colocar(noExterno, raioExterno, 1, Math.PI / noExterno);
  }

  return pontos;
}

function rotuloPasta(pasta?: string, nome?: string) {
  const t = (pasta || nome || "").trim();
  if (!t) return "—";
  // Abrevia nomes longos para caber na bolha
  if (t.length <= 18) return t;
  const palavras = t.replace(/^Ministério d[aeo]s?\s+/i, "").split(/\s+/);
  if (palavras.length === 1) return t.slice(0, 16) + "…";
  return palavras
    .map((p) => (p.length > 8 ? p.slice(0, 6) + "." : p))
    .join(" ")
    .slice(0, 22);
}

export default function ExecutivoRadial({
  presidente,
  ministros,
  height = 340,
  onSelectMinistro,
}: Props) {
  const [hoverId, setHoverId] = useState<string | number | null>(null);

  const corPres =
    CORES[presidente?.espectro || ""] || "#1e293b";

  const posicoes = useMemo(
    () => layoutAnel(ministros.length, 28, 42),
    [ministros.length]
  );

  const hoverItem =
    hoverId != null
      ? ministros.find((m) => m.id === hoverId) || null
      : null;

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 100 100"
        className="w-full"
        style={{ height, maxHeight: 420 }}
        role="img"
        aria-label="Organograma radial do Executivo Federal"
      >
        {/* Anéis guia sutis */}
        <circle cx="50" cy="50" r="28" fill="none" stroke="#e2e8f0" strokeWidth="0.25" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="0.25" />

        {/* Linhas do centro até cada ministério */}
        {ministros.map((m, i) => {
          const p = posicoes[i];
          if (!p) return null;
          const ativo = hoverId === m.id;
          return (
            <line
              key={`line-${m.id ?? i}`}
              x1="50"
              y1="50"
              x2={p.x}
              y2={p.y}
              stroke={ativo ? corPres : "#f87171"}
              strokeWidth={ativo ? 0.55 : 0.28}
              opacity={ativo ? 0.9 : 0.45}
            />
          );
        })}

        {/* Bolhas dos ministérios */}
        {ministros.map((m, i) => {
          const p = posicoes[i];
          if (!p) return null;
          const cor = CORES[m.espectro || ""] || "#64748b";
          const ativo = hoverId === m.id;
          const r = ativo ? 5.2 : 4.4;

          return (
            <g
              key={String(m.id ?? i)}
              style={{ cursor: onSelectMinistro ? "pointer" : "default" }}
              onMouseEnter={() => setHoverId(m.id ?? i)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => onSelectMinistro?.(m)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={r + 0.6}
                fill="#fff"
                stroke={cor}
                strokeWidth={ativo ? 0.55 : 0.35}
              />
              <circle cx={p.x} cy={p.y} r={r} fill={cor} opacity={0.92} />
              {/* Iniciais */}
              <text
                x={p.x}
                y={p.y + 0.9}
                textAnchor="middle"
                fill="#fff"
                fontSize="2.4"
                fontWeight="700"
              >
                {(m.nome || m.pasta || "?").charAt(0).toUpperCase()}
              </text>
              <title>
                {m.pasta || "Ministério"}
                {"\n"}
                {m.nome || ""}
                {m.partido ? ` • ${m.partido}` : ""}
                {m.espectro ? ` • ${m.espectro}` : ""}
              </title>
            </g>
          );
        })}

        {/* Núcleo — Presidente */}
        <circle cx="50" cy="50" r="11.5" fill="#fff" stroke={corPres} strokeWidth="0.7" />
        <circle cx="50" cy="50" r="10.2" fill={corPres} />
        <text
          x="50"
          y="48.2"
          textAnchor="middle"
          fill="#fff"
          fontSize="3.2"
          fontWeight="800"
        >
          PRESIDENTE
        </text>
        <text
          x="50"
          y="52.5"
          textAnchor="middle"
          fill="#fff"
          fontSize="2.4"
          fontWeight="600"
          opacity="0.95"
        >
          {(presidente?.nome || "—").split(" ").slice(0, 2).join(" ")}
        </text>
        {presidente?.partido && (
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fill="#fff"
            fontSize="2"
            opacity="0.85"
          >
            {presidente.partido}
          </text>
        )}
      </svg>

      {/* Legenda / detalhe no hover */}
      <div className="text-center text-xs text-slate-600 min-h-[2.5rem] -mt-1 px-2">
        {hoverItem ? (
          <span>
            <strong>{hoverItem.pasta || "Ministério"}</strong>
            {hoverItem.nome ? ` — ${hoverItem.nome}` : ""}
            {hoverItem.partido ? ` · ${hoverItem.partido}` : ""}
            {hoverItem.espectro ? (
              <span
                className="ml-1.5 inline-block w-2 h-2 rounded-full align-middle"
                style={{ background: CORES[hoverItem.espectro] || "#999" }}
              />
            ) : null}
          </span>
        ) : (
          <span className="text-slate-400">
            Passe o mouse nas bolhas para ver o ministério
            {ministros.length > 0 ? ` (${ministros.length} pastas)` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
