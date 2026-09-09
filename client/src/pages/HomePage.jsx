import { apiFetch } from '../api';
import { useAuth } from '../hooks/useAuth';
import { Play, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrazilMap from '../components/BrazilMap';
import ResumoApuracao from '../components/apuracao/ResumoApuracao';
import usePainelApuracao from '../hooks/usePainelApuracao';
import { fetchPreferenciasApuracao } from '../services/apuracao.service';

/**
 * HOME — mapa do Brasil + turno + iniciar pesquisa
 * Gráficos ficam em /pesquisas
 * Voto de presidente (na pesquisa) vai ao banco e soma na pesquisa NACIONAL
 *
 * Módulo de Apuração em Tempo Real (TSE): o mesmo mapa/estado escolhido
 * aqui também alimenta o painel de apuração (ver usePainelApuracao) —
 * não existe um segundo seletor de estado só para a apuração.
 */
export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [hasVoted, setHasVoted] = useState(false);
  const [respondents, setRespondents] = useState(0);
  const [loading, setLoading] = useState(true); // Estado de carregamento para a animação
  const [selectedUF, setSelectedUF] = useState(
    () => localStorage.getItem('xdenker_uf') || ''
  );
  const [selectedTurno, setSelectedTurno] = useState(
    () => localStorage.getItem('xdenker_turno') || '1'
  );

  // ---------- Apuração em Tempo Real ----------
  const [mostrarApuracao, setMostrarApuracao] = useState(false);
  const [preferenciaPesquisa, setPreferenciaPesquisa] = useState(null);
  const painel = usePainelApuracao(preferenciaPesquisa);

  useEffect(() => {
    const carregarPreferencias = async () => {
      try {
        const prefs = await fetchPreferenciasApuracao();
        if (prefs?.hasCompleted) {
          setPreferenciaPesquisa({
            uf: prefs.uf,
            presidenteId: prefs.presidenteId,
            governadorId: prefs.governadorId,
          });
        }
      } catch (e) {
        console.error('[apuracao] falha ao buscar preferências', e);
      }
    };
    carregarPreferencias();
  }, []);

  const userId = user?.userId || user?.id;

  useEffect(() => {
    const load = async () => {
      setLoading(true); // Inicia o carregamento animado
      try {
        const uf = selectedUF || 'CE';
        const res = await apiFetch(`/api/?uf=${uf}&turno=${selectedTurno}`);
        const json = await res.json();
        setRespondents(json?.methodology?.respondents ?? 0);

        if (isAuthenticated && userId) {
          const statusRes = await apiFetch('/api/research/status', {
            headers: {
              Authorization: 'Bearer temp',
              'X-User-Id': userId,
              'X-User-Name': user?.fullName || '',
            },
          });
          if (statusRes.ok) {
            const status = await statusRes.json();
            setHasVoted(!!status.hasCompleted);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false); // Finaliza o carregamento e exibe os dados reais com animação
      }
    };
    load();
  }, [isAuthenticated, userId, selectedUF, selectedTurno]);

  const handleSelectUF = (uf) => {
    setSelectedUF(uf);
    localStorage.setItem('xdenker_uf', uf);
    // Mesmo estado escolhido no mapa também vira o foco do painel de apuração
    painel.selecionarEstado(uf);
  };

  const handleStart = () => {
    if (!isAuthenticated) {
      alert('Faça login para iniciar o questionário.');
      return;
    }
    if (hasVoted) {
      alert('Você já participou desta pesquisa.');
      return;
    }
    if (!selectedUF) {
      alert('Escolha um estado no mapa antes de iniciar a pesquisa.');
      return;
    }
    localStorage.setItem('xdenker_uf', selectedUF);
    localStorage.setItem('xdenker_turno', selectedTurno);
    navigate('/questionario');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Título */}
      <div className="text-center pt-4 pb-2 px-4">
        <h1 className="text-base md:text-lg font-bold tracking-wide text-slate-800 uppercase">
          Pesquisa Eleitoral — Eleições 2026
        </h1>
      </div>

      {/* Banner OU Resumo da Apuração (troca com animação) */}
      <div className="px-4 md:px-8 mb-3 max-w-5xl mx-auto">
        {mostrarApuracao ? (
          <ResumoApuracao
            painel={painel}
            onVoltar={() => setMostrarApuracao(false)}
            onVerCompleta={() => navigate('/apuracao')}
          />
        ) : (
          <div className="relative rounded-2xl overflow-hidden shadow-md animate-in fade-in duration-300">
            <img
              src="/banner.jpg"
              alt="Sua Opinião Importa"
              className="w-full h-auto object-cover aspect-[2.8/1] md:aspect-[3/1]"
            />
            <button
              type="button"
              onClick={() => setMostrarApuracao(true)}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-6 inline-flex items-center gap-1 md:gap-2 bg-white/40 md:bg-white/95 hover:bg-white/70 md:hover:bg-white text-slate-800 font-medium md:font-semibold rounded-full px-2.5 py-1 md:px-5 md:py-2.5 text-[10px] md:text-sm shadow-sm md:shadow-lg backdrop-blur-[2px] md:backdrop-blur transition-all hover:scale-[1.03] whitespace-nowrap"
            >
              <BarChart3 size={11} className="text-amber-500 md:hidden" />
              <BarChart3 size={16} className="text-amber-500 hidden md:block" />
              Ver apuração em tempo real
            </button>
          </div>
        )}
      </div>

      {/* Mapa / Seleção de Estado */}
      <div className="px-4 md:px-8 mb-3 max-w-5xl mx-auto">
        <BrazilMap selectedUF={selectedUF} onSelect={handleSelectUF} />
      </div>

      {/* Dados em tempo real com indicador pulsante e spinner de carregamento */}
      <div className="px-4 md:px-8 mb-3 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-2 bg-white rounded-2xl border border-slate-100 p-3 shadow-sm items-center">
          {/* Coluna Dados: com LED verde pulsando em tempo real */}
          <div className="text-center">
            <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Dados</p>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700">Tempo real</span>
            </div>
          </div>

          {/* Coluna Respostas: Spinner rodando enquanto carrega, depois exibe o número real */}
          <div className="text-center border-x border-slate-100 px-2">
            <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Respostas</p>
            {loading ? (
              <div className="flex justify-center py-1">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-800 mt-0.5 animate-in fade-in duration-300">
                {respondents}
              </p>
            )}
          </div>

          {/* Coluna Percentuais/Ativos: Spinner rodando enquanto carrega, depois exibe o status real */}
          <div className="text-center">
            <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Percentuais</p>
            {loading ? (
              <div className="flex justify-center py-1">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-800 mt-0.5 animate-in fade-in duration-300">
                {respondents > 0 ? 'Ativos' : '0%'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Participe da Pesquisa */}
      <div className="px-4 md:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase mb-1">
            Participe da pesquisa
          </h2>
          <p className="text-sm text-slate-500 mb-1">
            Sua voz define o futuro. Vote e ajude a construir o cenário político.
          </p>
          <p className="text-xs text-slate-400 mb-4">Totalmente confidencial</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <select
              value={selectedTurno}
              onChange={(e) => {
                setSelectedTurno(e.target.value);
                localStorage.setItem('xdenker_turno', e.target.value);
              }}
              className="border-2 border-amber-400 rounded-xl px-3 py-2.5 text-sm font-semibold bg-white"
            >
              <option value="1">1º Turno</option>
              <option value="2">2º Turno</option>
            </select>

            <button
              type="button"
              onClick={handleStart}
              disabled={hasVoted || !selectedUF}
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-full px-6 py-3 text-sm flex-1"
            >
              <Play size={16} fill="currentColor" />
              {hasVoted ? 'Você já participou' : 'Iniciar Questionário'}
            </button>
          </div>

          {!selectedUF ? (
            <p className="text-xs text-amber-600 mt-3">
              Toque em um estado no mapa para liberar o botão de iniciar a pesquisa.
            </p>
          ) : (
            <p className="text-xs text-slate-500 mt-3">
              Pesquisa para <strong>{selectedUF}</strong>
              {selectedTurno === '2' ? ' · 2º turno' : ' · 1º turno'}.
              Gráficos em <strong>Pesquisas</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}