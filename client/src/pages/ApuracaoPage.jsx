import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BrazilMap from '../components/BrazilMap';
import ListaCandidatos from '../components/apuracao/ListaCandidatos';
import BarraEspectro from '../components/apuracao/BarraEspectro';
import MapaEspectroPolitico from '../components/apuracao/MapaEspectroPolitico';
import PainelExecutivoLateral from '../components/apuracao/PainelExecutivoLateral';
import DetalhesCandidato from '../components/apuracao/DetalhesCandidato';
import RankingLegislativo from '../components/apuracao/RankingLegislativo';
import usePainelApuracao from '../hooks/usePainelApuracao';
import useApuracaoCargo from '../hooks/useApuracaoCargo';
import useMapaGovernador from '../hooks/useMapaGovernador';
import { fetchPreferenciasApuracao } from '../services/apuracao.service';
import { SPECTRUM_ORDER } from '../data/spectrumColors';

const CARGOS = [
  { id: 'presidente', label: 'Presidente' },
  { id: 'governador', label: 'Governador' },
  { id: 'senador', label: 'Senador' },
  { id: 'deputado_federal', label: 'Dep. Federal' },
  { id: 'deputado_estadual', label: 'Dep. Estadual' },
];

const CARGOS_COM_UF = ['governador', 'senador', 'deputado_federal', 'deputado_estadual'];
const CARGOS_LEGISLATIVOS = ['senador', 'deputado_federal', 'deputado_estadual'];

/**
 * Página completa de Apuração em Tempo Real (/apuracao).
 *
 * MOBILE: mantém o comportamento já validado nas etapas anteriores
 * (abas + mapa/barra + lista), sem alterações nesta etapa.
 *
 * DESKTOP: layout em 3 colunas —
 * - Esquerda: Presidente + Governador sempre visíveis (resumo fixo),
 *   clicáveis (troca a aba ativa e seleciona candidato p/ painel direito).
 * - Centro: mapa por espectro (Presidente/Governador) OU ranking com busca
 *   (Legislativo) — nunca os dois ao mesmo tempo.
 * - Direita: detalhes oficiais do candidato selecionado.
 *
 * Adiado para uma próxima etapa (fora do escopo desta): drill-down para
 * malha municipal, busca global no topo cruzando todos os cargos, e dados
 * reais de vice/suplentes (hoje mostrados como "não disponível").
 */
export default function ApuracaoPage() {
  const navigate = useNavigate();
  const [cargoAtivo, setCargoAtivo] = useState('presidente');
  const [filtroEspectro, setFiltroEspectro] = useState(null);
  const [preferenciaPesquisa, setPreferenciaPesquisa] = useState(null);
  const [selecao, setSelecao] = useState(null); // { cargo, candidato }

  const painel = usePainelApuracao(preferenciaPesquisa);

  useEffect(() => {
    fetchPreferenciasApuracao()
      .then((prefs) => {
        if (prefs?.hasCompleted) {
          setPreferenciaPesquisa({
            uf: prefs.uf,
            presidenteId: prefs.presidenteId,
            governadorId: prefs.governadorId,
          });
        }
      })
      .catch((e) => console.error('[apuracao] falha ao buscar preferências', e));
  }, []);

  // Reseta filtro de espectro e seleção de candidato ao trocar de estado
  useEffect(() => {
    setFiltroEspectro(null);
    setSelecao(null);
  }, [painel.uf]);

  const precisaDeUF = CARGOS_COM_UF.includes(cargoAtivo);
  const ehLegislativo = CARGOS_LEGISLATIVOS.includes(cargoAtivo);

  // Dado do cargo ativo (usado no conteúdo central/detalhes)
  const { dados, loading, erro } = useApuracaoCargo(cargoAtivo, painel.uf);

  // Presidente e Governador são buscados sempre, independente da aba ativa,
  // porque o painel esquerdo do desktop os mostra o tempo todo.
  const { dados: dadosPresidente } = useApuracaoCargo('presidente', null);
  const { dados: dadosGovernador } = useApuracaoCargo('governador', painel.uf);

  const { dados: mapaGovernador } = useMapaGovernador(cargoAtivo === 'governador');

  const handleSelecionarUF = (uf) => {
    painel.selecionarEstado(uf);
  };

  const handleSelecionarNoPainelEsquerdo = (cargo, candidato) => {
    setCargoAtivo(cargo);
    setSelecao({ cargo, candidato });
  };

  const handleSelecionarNoRanking = (candidato) => {
    setSelecao({ cargo: cargoAtivo, candidato });
  };

  // Agregação client-side (só apresentação): nº de estados liderados por
  // espectro — substitui o mapa no mobile para Governador.
  const estadosPorEspectro = useMemo(() => {
    if (!mapaGovernador?.ufs) return null;
    const contagem = Object.fromEntries(SPECTRUM_ORDER.map((k) => [k, 0]));
    mapaGovernador.ufs.forEach((item) => {
      contagem[item.leaderSpectrum] = (contagem[item.leaderSpectrum] || 0) + 1;
    });
    return contagem;
  }, [mapaGovernador]);

  const listaFiltrada = useMemo(() => {
    const candidatos = dados?.candidates || dados?.eleitos || [];
    if (!filtroEspectro) return candidatos;
    return candidatos.filter((c) => c.spectrum === filtroEspectro);
  }, [dados, filtroEspectro]);

  const rankingTop7 = useMemo(() => {
    return (dados?.eleitos || []).slice(0, 7);
  }, [dados]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-4">
          Apuração em Tempo Real — Eleições 2026
        </h1>

        {/* Abas de cargo */}
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {CARGOS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCargoAtivo(c.id)}
              className={`flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors ${cargoAtivo === c.id
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* ==================== DESKTOP: 3 colunas ==================== */}
        <div className="hidden md:grid grid-cols-[260px_1fr_260px] gap-4 items-start">
          <PainelExecutivoLateral
            presidente={dadosPresidente}
            governador={dadosGovernador}
            uf={painel.uf}
            candidatoSelecionadoId={selecao?.candidato?.id}
            onSelecionarCandidato={handleSelecionarNoPainelEsquerdo}
          />

          <div>
            {ehLegislativo ? (
              <RankingLegislativo
                cargo={cargoAtivo}
                uf={painel.uf}
                candidatos={rankingTop7}
                candidatoSelecionadoId={selecao?.candidato?.id}
                onSelecionarCandidato={handleSelecionarNoRanking}
              />
            ) : (
              <MapaEspectroPolitico
                ufsData={mapaGovernador?.ufs}
                ufSelecionada={painel.uf}
                onSelecionarUF={handleSelecionarUF}
              />
            )}

            {precisaDeUF && (
              <div className="mt-4">
                <BrazilMap selectedUF={painel.uf || ''} onSelect={handleSelecionarUF} />
              </div>
            )}
          </div>

          <DetalhesCandidato
            candidato={selecao?.candidato}
            cargo={selecao?.cargo}
            uf={painel.uf}
          />
        </div>

        {/* ==================== MOBILE: fluxo já existente ==================== */}
        <div className="md:hidden">
          {cargoAtivo === 'presidente' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
              <TurnoInfo turno={dados?.turno} />
              <UrnasApuradas valor={dados?.urnasApuradas} />
            </div>
          )}

          {cargoAtivo === 'governador' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
              <p className="text-center text-[11px] font-bold uppercase text-slate-500 mb-2">
                Cenário nacional por espectro (Governador)
              </p>
              {estadosPorEspectro ? (
                <BarraEspectro dados={estadosPorEspectro} />
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">Carregando...</p>
              )}
            </div>
          )}

          {precisaDeUF && (
            <div className="mb-4">
              <BrazilMap selectedUF={painel.uf || ''} onSelect={handleSelecionarUF} />
            </div>
          )}

          {ehLegislativo && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
              <p className="text-center text-[11px] font-bold uppercase text-slate-500 mb-2">
                Eleitos por espectro {painel.uf ? `— ${painel.uf}` : ''}
              </p>
              {dados?.porEspectro ? (
                <BarraEspectro
                  dados={dados.porEspectro}
                  onClickSegmento={(chave) =>
                    setFiltroEspectro((atual) => (atual === chave ? null : chave))
                  }
                  filtroAtivo={filtroEspectro}
                />
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">
                  {painel.uf ? 'Carregando...' : 'Escolha um estado abaixo.'}
                </p>
              )}
            </div>
          )}

          <div>
            {loading && !dados ? (
              <p className="text-center text-sm text-slate-400 py-8">Carregando apuração...</p>
            ) : erro ? (
              <p className="text-center text-sm text-red-500 py-8">{erro}</p>
            ) : precisaDeUF && !painel.uf ? (
              <p className="text-center text-sm text-slate-400 py-8">
                Escolha um estado no mapa acima para ver os candidatos.
              </p>
            ) : (
              <>
                {cargoAtivo === 'governador' && <TurnoInfo turno={dados?.turno} />}
                <ListaCandidatos candidatos={listaFiltrada} />
              </>
            )}
          </div>
        </div>

        {dados?.warning && (
          <p className="text-center text-xs text-amber-600 mt-4">{dados.warning}</p>
        )}
      </div>
    </div>
  );
}

function TurnoInfo({ turno }) {
  if (!turno) return null;
  return (
    <p
      className={`text-center text-xs md:text-sm font-semibold mb-3 ${turno.decidido ? 'text-emerald-600' : 'text-amber-600'
        }`}
    >
      {turno.decidido
        ? `Eleito no 1º turno: ${turno.eleito?.name}`
        : 'Ninguém atingiu 50% dos votos válidos — vai para o 2º turno'}
    </p>
  );
}

function UrnasApuradas({ valor }) {
  if (valor === undefined) return null;
  return (
    <div>
      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
        <span>Urnas apuradas</span>
        <span>{valor}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all"
          style={{ width: `${valor}%` }}
        />
      </div>
    </div>
  );
}
