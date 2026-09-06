import { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoMercator } from 'd3-geo';
import { Plus, Minus } from 'lucide-react';

const GEOJSON_MUNICIPIOS_URL = '/geo/brasil-municipios.geojson';
const LARGURA = 480;
const ALTURA = 420;

/** Hash simples e determinístico — mesma entrada sempre gera o mesmo número. */
function hashCodigo(codigo, seed) {
  let h = seed;
  const str = String(codigo);
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Drill-down municipal — mostra só o território do estado selecionado,
 * com cada município colorido pelo candidato mais votado ali. Reutilizado
 * tanto para Governador quanto para Presidente (o componente não sabe/não
 * precisa saber qual cargo é — só recebe `candidatos` já resolvidos).
 *
 * MOCK: ainda não há resultado real do TSE por município. O "vencedor" de
 * cada um é escolhido de forma determinística (hash do código IBGE) entre
 * os candidatos já resolvidos para a UF (mesma cor/espectro que já vêm do
 * backend) — assim a cor de cada município fica estável entre
 * atualizações de 30s, sem "piscar" aleatoriamente.
 *
 * Encaixe do mapa: `geoMercator().fitSize()` calcula automaticamente a
 * escala certa para O ESTADO SELECIONADO caber no espaço disponível —
 * sem isso, um estado pequeno (ex. Ceará) apareceria minúsculo usando a
 * mesma escala do Brasil inteiro.
 *
 * Zoom: desktop tem botões +/- (estilo vidro fosco); mobile usa pinça no
 * touch — suporte nativo do ZoomableGroup, sem UI extra.
 */
export default function MapaMunicipiosGovernador({ uf, candidatos }) {
  const [geoData, setGeoData] = useState(null);
  const [erro, setErro] = useState(false);
  const [hover, setHover] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    fetch(GEOJSON_MUNICIPIOS_URL)
      .then((res) => {
        if (!res.ok) throw new Error('geojson de municípios não encontrado');
        return res.json();
      })
      .then(setGeoData)
      .catch(() => setErro(true));
  }, []);

  const municipiosDoEstado = useMemo(() => {
    if (!geoData) return [];
    return geoData.features.filter((f) => f.properties.uf === uf);
  }, [geoData, uf]);

  const featureCollectionEstado = useMemo(
    () => ({ type: 'FeatureCollection', features: municipiosDoEstado }),
    [municipiosDoEstado]
  );

  const projecao = useMemo(() => {
    if (!municipiosDoEstado.length) return null;
    return geoMercator().fitSize([LARGURA, ALTURA], featureCollectionEstado);
  }, [municipiosDoEstado, featureCollectionEstado]);

  // Reseta zoom/pan sempre que troca de estado
  useEffect(() => {
    setZoom(1);
    setCenter([0, 0]);
  }, [uf]);

  const vencedorPorMunicipio = useMemo(() => {
    const mapa = {};
    if (!candidatos?.length) return mapa;
    municipiosDoEstado.forEach((f) => {
      const codigo = f.properties.codigo_ibge;
      const idx = hashCodigo(codigo, 17) % candidatos.length;
      const vencedor = candidatos[idx];
      const percentLocal = 35 + (hashCodigo(codigo, 91) % 3600) / 100; // 35.00 a 70.99
      mapa[codigo] = { ...vencedor, percentLocal: Number(percentLocal.toFixed(2)) };
    });
    return mapa;
  }, [municipiosDoEstado, candidatos]);

  if (erro) {
    return (
      <div className="flex items-center justify-center bg-white rounded-2xl border border-slate-100 p-4 h-[380px] text-sm text-slate-400 text-center px-8">
        Não foi possível carregar o mapa de municípios (arquivo brasil-municipios.geojson não
        encontrado em /public/geo/).
      </div>
    );
  }

  if (!geoData || !projecao) {
    return (
      <div className="flex items-center justify-center bg-white rounded-2xl border border-slate-100 p-4 h-[380px] text-sm text-slate-400">
        Carregando municípios de {uf}...
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl border border-slate-100 p-4">
      {/* Tooltip — só faz sentido com mouse (desktop); no touch não há hover */}
      <p className="hidden md:block text-center text-xs font-semibold text-slate-600 mb-2 h-4">
        {hover ? `${hover.nome} — ${hover.vencedor?.name}: ${hover.vencedor?.percentLocal}%` : ' '}
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
            <Geographies geography={featureCollectionEstado}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const codigo = geo.properties.codigo_ibge;
                  const nome = geo.properties.nome;
                  const vencedor = vencedorPorMunicipio[codigo];
                  const cor = vencedor?.color || '#e2e8f0';
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHover({ nome, vencedor })}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        default: { fill: cor, stroke: '#fff', strokeWidth: 0.3, outline: 'none' },
                        hover: { fill: cor, opacity: 0.8, outline: 'none' },
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
        {municipiosDoEstado.length} municípios de {uf} — cor mock (aguardando dado real do TSE por
        município)
      </p>
    </div>
  );
}
