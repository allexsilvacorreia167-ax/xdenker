import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BrazilMap from '../components/BrazilMap';
import MapaEspectroPolitico from '../components/apuracao/MapaEspectroPolitico';
import PainelExecutivoLateral from '../components/apuracao/PainelExecutivoLateral';
import DetalhesCandidato from '../components/apuracao/DetalhesCandidato';
import RankingLegislativo from '../components/apuracao/RankingLegislativo';
import usePainelApuracao from '../hooks/usePainelApuracao';
import useApuracaoCargo from '../hooks/useApuracaoCargo';
import useMapaGovernador from '../hooks/useMapaGovernador';
import useMapaPresidente from '../hooks/useMapaPresidente';
import { fetchPreferenciasApuracao } from '../services/apuracao.service';

const CARGOS = [
  { id: 'presidente', label: 'Presidente' },
  { id: 'governador', label: 'Governador' },
  { id: 'senador', label: 'Senador' },
  { id: 'deputado_federal', label: 'Dep. Federal' },
  { id: 'deputado_estadual', label: 'Dep. Estadual' },
];

const CARGOS_LEGISLATIVOS = ['senador', 'deputado_federal', 'deputado_estadual'];

/**
 * Página completa de Apuração em Tempo Real (/apuracao).
 *
 * Layout ÚNICO e responsivo — 1 coluna empilhada no mobile, 3 colunas no
 * desktop (grid-cols-1 md:grid-cols-[260px_1fr_260px]).
 *
 * - Esquerda: Presidente + Governador sempre visíveis, clicáveis.
 * - Centro: mapa por candidato líder (Presidente) ou por espectro
 *   (Governador), OU ranking com busca (Legislativo).
 * - Direita: detalhes do candidato selecionado — no Legislativo, some no
 *   mobile (o RankingLegislativo já mostra o detalhe inline, ver seu
 *   próprio arquivo), mas continua aparecendo no desktop.
 *
 * O seletor de estado (BrazilMap, ícones por UF) só aparece na aba
 * Governador — nos cargos legislativos, o estado já vem escolhido de lá,
 * repetir o seletor seria redundante.
 *
 * Adiado para uma próxima etapa: drill-down para malha municipal do
 * Governador (mapa mostrando só o estado selecionado), tooltip do mapa
 * com % do candidato selecionado, busca global cruzando todos os cargos,
 * dados reais de vice/suplentes.
 */
export default function ApuracaoPage() {
  const navigate = useNavigate();
  const [cargoAtivo, setCargoAtivo] = useState('presidente');
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

  // Reseta a seleção de candidato ao trocar de estado
  useEffect(() => {
    setSelecao(null);
  }, [painel.uf]);

  const ehLegislativo = CARGOS_LEGISLATIVOS.includes(cargoAtivo);

  const { dados, loading, erro } = useApuracaoCargo(cargoAtivo, painel.uf);

  // Presidente e Governador são buscados sempre (painel esquerdo os mostra
  // o tempo todo, independente da aba ativa no topo).
  const { dados: dadosPresidente } = useApuracaoCargo('presidente', null);
  const { dados: dadosGovernador } = useApuracaoCargo('governador', painel.uf);

  const { dados: mapaGovernador } = useMapaGovernador(cargoAtivo === 'governador');
  const { dados: mapaPresidente } = useMapaPresidente(cargoAtivo === 'presidente');

  const handleSelecionarUF = (uf) => {
    painel.selecionarEstado(uf);
  };

  const handleSelecionarNoPainelEsquerdo = (cargo, candidato) => {
    setCargoAtivo(cargo);
    setSelecao({ cargo, candidato });
  };

  const handleSelecionarNoRanking = (candidato) => {
    setSelecao(candidato ? { cargo: cargoAtivo, candidato } : null);
  };

  // Clique no mapa: Governador troca o estado em foco; Presidente só
  // seleciona o candidato líder daquele estado para o painel de detalhes
  // (a lista de candidatos de Presidente não depende de UF).
  const handleClickMapa = (uf) => {
    if (cargoAtivo === 'governador') {
      handleSelecionarUF(uf);
      return;
    }
    if (cargoAtivo === 'presidente') {
      const item = mapaPresidente?.ufs?.find((x) => x.uf === uf);
      const candidato = dadosPresidente?.candidates?.find((c) => c.id === item?.leaderId);
      if (candidato) setSelecao({ cargo: 'presidente', candidato });
    }
  };

  const rankingTop7 = useMemo(() => (dados?.eleitos || []).slice(0, 7), [dados]);

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

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-3">
          Apuração em Tempo Real — Eleições 2026
        </h1>

        {/* Turno + urnas apuradas — só para Presidente/Governador, logo abaixo do título */}
        {!ehLegislativo && (dados?.turno || dados?.urnasApuradas !== undefined) && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
            <TurnoInfo turno={dados?.turno} />
            <UrnasApuradas valor={dados?.urnasApuradas} />
          </div>
        )}

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

        {/* Layout único: 1 coluna empilhada no mobile, 3 colunas no desktop */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_260px] gap-4 items-start">
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
              <>
                <MapaEspectroPolitico
                  ufsData={cargoAtivo === 'presidente' ? mapaPresidente?.ufs : mapaGovernador?.ufs}
                  ufSelecionada={cargoAtivo === 'governador' ? painel.uf : null}
                  onSelecionarUF={handleClickMapa}
                />

                {/* Seletor de estado — só faz sentido para Governador */}
                {cargoAtivo === 'governador' && (
                  <div className="mt-4">
                    <BrazilMap selectedUF={painel.uf || ''} onSelect={handleSelecionarUF} />
                  </div>
                )}
              </>
            )}

            {loading && !dados && (
              <p className="text-center text-sm text-slate-400 py-4">Carregando apuração...</p>
            )}
            {erro && <p className="text-center text-sm text-red-500 py-4">{erro}</p>}
            {dados?.warning && (
              <p className="text-center text-xs text-amber-600 mt-3">{dados.warning}</p>
            )}
          </div>

          {/* No mobile, Legislativo já mostra o detalhe inline (dentro do
              RankingLegislativo) — esconder essa coluna evita duplicar.
              No desktop, continua sempre visível como coluna dedicada. */}
          <div className={ehLegislativo ? 'hidden md:block' : ''}>
            <DetalhesCandidato
              candidato={selecao?.candidato}
              cargo={selecao?.cargo}
              uf={painel.uf}
            />
          </div>
        </div>
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
