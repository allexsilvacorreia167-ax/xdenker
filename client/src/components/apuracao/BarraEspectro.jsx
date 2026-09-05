import { SPECTRUM_ORDER, SPECTRUM_COLORS } from '../../data/spectrumColors';

/**
 * Barra horizontal segmentada por espectro político.
 * `dados` = { Esquerda: n, 'Centro-Esquerda': n, Centro: n, 'Centro-Direita': n, Direita: n }
 *
 * Usos:
 * - Governador no mobile: substitui o mapa, `dados` = nº de estados
 *   liderados por cada espectro (agregado a partir de /mapa-governador).
 * - Legislativo (Senador/Dep. Federal/Dep. Estadual), mobile e desktop:
 *   `dados` = nº de candidatos eleitos por espectro (vem pronto do backend,
 *   campo `porEspectro`). Clicável para filtrar a lista de eleitos.
 */
export default function BarraEspectro({ dados, onClickSegmento, filtroAtivo }) {
  const total = SPECTRUM_ORDER.reduce((soma, chave) => soma + (dados?.[chave] || 0), 0);

  if (!total) {
    return <p className="text-xs text-slate-400 text-center py-3">Sem dados ainda para este recorte.</p>;
  }

  return (
    <div>
      <div className="flex h-3 md:h-4 rounded-full overflow-hidden bg-slate-100">
        {SPECTRUM_ORDER.map((chave) => {
          const valor = dados?.[chave] || 0;
          if (!valor) return null;
          const largura = (valor / total) * 100;
          const ativo = filtroAtivo === chave;
          return (
            <button
              key={chave}
              type="button"
              disabled={!onClickSegmento}
              onClick={() => onClickSegmento?.(chave)}
              title={`${chave}: ${valor}`}
              style={{
                width: `${largura}%`,
                backgroundColor: SPECTRUM_COLORS[chave],
                opacity: filtroAtivo && !ativo ? 0.4 : 1,
              }}
              className="h-full transition-opacity hover:opacity-80 disabled:cursor-default"
            />
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
        {SPECTRUM_ORDER.map((chave) => {
          const valor = dados?.[chave] || 0;
          if (!valor) return null;
          return (
            <button
              key={chave}
              type="button"
              disabled={!onClickSegmento}
              onClick={() => onClickSegmento?.(chave)}
              className="flex items-center gap-1 text-[10px] md:text-xs text-slate-600 disabled:cursor-default"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: SPECTRUM_COLORS[chave] }}
              />
              {chave}: <strong>{valor}</strong>
            </button>
          );
        })}
      </div>
    </div>
  );
}
