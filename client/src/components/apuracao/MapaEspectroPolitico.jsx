import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// Servido como arquivo estático — ver client/public/geo/brasil-uf.geojson
const GEOJSON_URL = '/geo/brasil-uf.geojson';

/**
 * Mapa do Brasil por UF, colorido pelo espectro político do líder de
 * Governador em cada estado. Exclusivo de desktop (ver regra no
 * ApuracaoPage — no mobile, BarraEspectro assume esse papel).
 *
 * `ufsData` vem de fetchMapaGovernador(): [{ uf, leaderSpectrum, color }]
 */
export default function MapaEspectroPolitico({ ufsData, ufSelecionada, onSelecionarUF }) {
  const [geoData, setGeoData] = useState(null);
  const [erro, setErro] = useState(false);

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
      <div className="hidden md:flex items-center justify-center bg-white rounded-2xl border border-slate-100 p-4 h-[380px] text-sm text-slate-400 text-center px-8">
        Não foi possível carregar o mapa (arquivo brasil-uf.geojson não encontrado em /public/geo/).
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="hidden md:flex items-center justify-center bg-white rounded-2xl border border-slate-100 p-4 h-[380px] text-sm text-slate-400">
        Carregando mapa...
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-white rounded-2xl border border-slate-100 p-4">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [-53, -14], scale: 750 }}
        width={480}
        height={420}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const sigla = geo.properties.sigla;
              const cor = corPorUf[sigla] || '#e2e8f0';
              const ativo = sigla === ufSelecionada;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onSelecionarUF?.(sigla)}
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
      <p className="text-center text-[11px] text-slate-400 mt-1">
        Clique em um estado para focar a apuração de Governador.
      </p>
    </div>
  );
}
