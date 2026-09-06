import { useEffect, useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoMercator } from 'd3-geo';
import { Plus, Minus } from 'lucide-react';

// Servido como arquivo estático — ver client/public/geo/brasil-uf.geojson
const GEOJSON_URL = '/geo/brasil-uf.geojson';
const LARGURA = 480;
const ALTURA = 420;

/**
 * Mapa do Brasil por UF, colorido pelo espectro/candidato líder em cada
 * estado (Governador) ou pelo candidato líder nacional por estado
 * (Presidente).
 *
 * `ufsData` vem de fetchMapaGovernador()/fetchMapaPresidente():
 * [{ uf, leaderName, leaderPercent, color }]
 *
 * Encaixe do mapa: em vez de projectionConfig com centro/escala "no olho"
 * (que cortava as pontas do país), usamos `geoMercator().fitSize()` do
 * d3-geo, que calcula automaticamente o centro/escala corretos para o
 * território caber inteiro no espaço disponível — mesma técnica usada no
 * mapa municipal.
 *
 * Zoom: botões +/- (desktop, estilo vidro fosco) + pinça no touch
 * (mobile, suporte nativo do ZoomableGroup) — permite ampliar até dar
 * pra distinguir melhor estados menores/vizinhos.
 */
export default function MapaEspectroPolitico({ ufsData, ufSelecionada, onSelecionarUF }) {
  const [geoData, setGeoData] = useState(null);
  const [erro, setErro] = useState(false);
  const [estadoHover, setEstadoHover] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([-53, -14]);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error('geojson não encontrado');
        return res.json();
      })
      .then(setGeoData)
      .catch(() => setErro(true));
  }, []);

  const projecao = useMemo(() => {
    if (!geoData) return null;
    return geoMercator().fitSize([LARGURA, ALTURA], geoData);
  }, [geoData]);

  const corPorUf = {};
  const dadosPorUf = {};
  (ufsData || []).forEach((item) => {
    corPorUf[item.uf] = item.color;
    dadosPorUf[item.uf] = item;
  });

  if (erro) {
    return (
      <div className="flex items-center justify-center bg-white rounded-2xl border border-slate-100 p-4 h-[380px] text-sm text-slate-400 text-center px-8">
        Não foi possível carregar o mapa (arquivo brasil-uf.geojson não encontrado em /public/geo/).
      </div>
    );
  }

  if (!geoData || !projecao) {
    return (
      <div className="flex items-center justify-center bg-white rounded-2xl border border-slate-100 p-4 h-[380px] text-sm text-slate-400">
        Carregando mapa...
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl border border-slate-100 p-4">
      {/* Tooltip com % — só faz sentido com mouse (desktop) */}
      <p className="hidden md:block text-center text-xs font-semibold text-slate-600 mb-2 h-4">
        {estadoHover
          ? `${estadoHover.nome} (${estadoHover.sigla})${estadoHover.leaderName
            ? ` — ${estadoHover.leaderName}: ${estadoHover.leaderPercent?.toFixed(2)}%`
            : ''
          }`
          : ' '}
      </p>

      <div className="flex justify-center">
        <ComposableMap projection={projecao} width={LARGURA} height={ALTURA} style={{ width: '100%', maxWidth: LARGURA, height: 'auto' }}>
          <ZoomableGroup
            center={center}
            zoom={zoom}
            onMoveEnd={({ zoom: z, coordinates }) => {
              setZoom(z);
              setCenter(coordinates);
            }}
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
                      onMouseEnter={() => setEstadoHover({ sigla, nome, ...dadosPorUf[sigla] })}
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
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Zoom +/- — só desktop, estilo vidro fosco. Mobile usa pinça no touch. */}
      <div className="hidden md:flex flex-col gap-1.5 absolute bottom-6 right-6">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z * 1.5, 8))}
          className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white/70 transition-colors"
          aria-label="Aumentar zoom"
        >
          <Plus size={14} />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z / 1.5, 1))}
          className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white/70 transition-colors"
          aria-label="Diminuir zoom"
        >
          <Minus size={14} />
        </button>
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-1">
        Clique em um estado para focar a apuração.
      </p>
    </div>
  );
}
