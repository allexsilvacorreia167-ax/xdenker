import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// Servido como arquivo estático — ver client/public/geo/brasil-uf.geojson
const GEOJSON_URL = '/geo/brasil-uf.geojson';

/**
 * Mapa do Brasil por UF, colorido pelo espectro político do líder de
 * Governador (ou Presidente, quando usado nesse modo) em cada estado.
 *
 * `ufsData` vem de fetchMapaGovernador(): [{ uf, leaderSpectrum, color }]
 *
 * Centralização: o ComposableMap do react-simple-maps já renderiza o SVG
 * em width 100% do container por padrão — width/height nas props só
 * definem o viewBox/proporção. Por isso o container precisa só de
 * `flex justify-center` e uma largura definida pelo layout pai (coluna
 * central da página) para o mapa ficar centralizado de verdade.
 */
export default function MapaEspectroPolitico({ ufsData, ufSelecionada, onSelecionarUF }) {
  const [geoData, setGeoData] = useState(null);
  const [erro, setErro] = useState(false);
  const [estadoHover, setEstadoHover] = useState(null);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error('geojson não encontrado');
        return res.json();
      })
      .then(setGeoData)
      .catch(() => setErro(true));
  }, []);

  const corPorUf = {};
  (ufsData || []).forEach((item) => {
    corPorUf[item.uf] = item.color;
  });

  if (erro) {
    return (
      <div className="flex items-center justify-center bg-white rounded-2xl border border-slate-100 p-4 h-[380px] text-sm text-slate-400 text-center px-8">
        Não foi possível carregar o mapa (arquivo brasil-uf.geojson não encontrado em /public/geo/).
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="flex items-center justify-center bg-white rounded-2xl border border-slate-100 p-4 h-[380px] text-sm text-slate-400">
        Carregando mapa...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      {/* Tooltip simples: linha de status acima do mapa, atualiza no hover */}
      <p className="text-center text-xs font-semibold text-slate-600 mb-2 h-4">
        {estadoHover ? `${estadoHover.nome} (${estadoHover.sigla})` : ' '}
      </p>

      <div className="flex justify-center">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-53, -14], scale: 750 }}
          width={480}
          height={420}
          style={{ width: '100%', maxWidth: 480, height: 'auto' }}
        >
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const sigla = geo.properties.sigla;
                const nome = geo.properties.nome;
                const cor = corPorUf[sigla] || '#e2e8f0';
                const ativo = sigla === ufSelecionada;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onSelecionarUF?.(sigla)}
                    onMouseEnter={() => setEstadoHover({ sigla, nome })}
                    onMouseLeave={() => setEstadoHover(null)}
                    style={{
                      default: {
                        fill: cor,
                        stroke: '#fff',
                        strokeWidth: ativo ? 1.5 : 0.5,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      hover: { fill: cor, opacity: 0.8, outline: 'none', cursor: 'pointer' },
                      pressed: { fill: cor, outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-1">
        Clique em um estado para focar a apuração.
      </p>
    </div>
  );
}
