import { apiFetch } from '../api';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle2, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UFS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const BAR_COLORS = [
  'bg-slate-800',
  'bg-amber-500',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-rose-500',
  'bg-violet-600',
];

function CandidateBars({ candidates, emptyLabel }) {
  if (!candidates?.length) {
    return (
      <p className="text-sm text-slate-400 text-center py-8">
        Nenhum candidato ativo no ADM
      </p>
    );
  }

  const hasVotes = candidates.some((c) => c.votes > 0);
  const maxPercent = Math.max(...candidates.map((c) => c.percent), 1);

  return (
    <div>
      <div className="flex items-end justify-center gap-4 md:gap-6 h-40 px-2">
        {candidates.map((c, i) => {
          const h = hasVotes ? Math.max(8, Math.round((c.percent / maxPercent) * 140)) : 8;
          return (
            <div key={c.id} className="flex flex-col items-center w-14 md:w-16">
              <span className="text-sm font-bold text-slate-700 mb-1">{c.percent}%</span>
              <div
                className={`w-10 md:w-12 ${BAR_COLORS[i % BAR_COLORS.length]} rounded-t-md transition-all duration-500`}
                style={{ height: `${h}px` }}
                title={`${c.votes || 0} voto(s)`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-1 mt-3 text-xs text-slate-600">
        {candidates.map((c, i) => (
          <span key={c.id} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${BAR_COLORS[i % BAR_COLORS.length]}`} />
            {c.name}
            {c.party ? ` (${c.party})` : ''}: {c.percent}%
            {typeof c.votes === 'number' ? ` · ${c.votes} voto(s)` : ''}
          </span>
        ))}
      </div>
      {!hasVotes && (
        <p className="text-center text-xs text-slate-400 mt-2">{emptyLabel}</p>
      )}
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedUF, setSelectedUF] = useState(
    () => localStorage.getItem('xdenker_uf') || 'CE'
  );
  const [selectedTurno, setSelectedTurno] = useState(
    () => localStorage.getItem('xdenker_turno') || '1'
  );

  const userId = user?.userId || user?.id;

  const fetchHomeData = async () => {
    try {
      const res = await apiFetch(`/api/?uf=${selectedUF || 'CE'}&turno=${selectedTurno}`);
      const json = await res.json();
      setData(json);

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
    } catch (err) {
      console.error('Erro ao carregar home:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
    const interval = setInterval(fetchHomeData, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, userId, selectedUF, selectedTurno]);

  const handleStartQuestionnaire = () => {
    if (!isAuthenticated) {
      alert('Faça login para iniciar o questionário.');
      return;
    }
    if (hasVoted) {
      alert('Você já participou desta pesquisa.');
      return;
    }

    localStorage.setItem('xdenker_uf', selectedUF);
    localStorage.setItem('xdenker_turno', selectedTurno);

    navigate('/questionario');
  };

  const president = data?.summaryCharts?.presidente || [];

  // Lógica de extração dinâmica corrigida:
  const govRaw = data?.summaryCharts?.governador;
  console.log("DADOS DO GOVERNADOR:", govRaw);
  const governor = (govRaw && typeof govRaw === 'object' && !Array.isArray(govRaw))
    ? (govRaw[selectedUF] || [])
    : (Array.isArray(govRaw) ? govRaw : []);

  const respondents = data?.methodology?.respondents ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-slate-400">Carregando pesquisa...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="text-center pt-6 pb-4 px-4">
        <h1 className="text-base md:text-lg font-bold tracking-wide text-slate-800 uppercase">
          Pesquisa Eleitoral — Eleições 2026
        </h1>
      </div>

      <div className="px-4 md:px-8 mb-6 max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-md">
          <img
            src="/banner.jpg"
            alt="Sua Opinião Importa — Pesquisa Eleitoral 2026"
            className="w-full h-auto object-cover aspect-[2.8/1] md:aspect-[3/1]"
          />
        </div>
      </div>

      <div className="px-4 md:px-8 mb-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6">
          <h2 className="text-base font-bold text-slate-800 mb-5">Intenção de Voto ({selectedTurno}º Turno)</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-3 text-center">Presidente</p>
              <CandidateBars candidates={president} emptyLabel="Aguardando primeiros votos" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500 mb-3 text-center">
                Governador ({selectedUF})
              </p>
              <CandidateBars candidates={governor} emptyLabel="Aguardando primeiros votos" />
            </div>

            <div className="flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
              <img src="/logo.png" alt="XDENKER" className="h-10 w-auto object-contain mb-3" />
              <p className="text-xs font-semibold text-slate-500 mb-1">Metodologia</p>
              <p className="text-sm text-slate-700">
                Respondentes: <strong>{respondents.toLocaleString('pt-BR')}</strong>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {respondents > 0
                  ? `Margem de erro: ${data?.methodology?.marginOfError || '±1.5%'}`
                  : 'Sem pesquisas ainda — percentuais em 0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase mb-1">
              Participe da Pesquisa
            </h2>
            <p className="text-sm text-slate-500">
              Sua voz define o futuro. Vote e ajude a construir o cenário político.
            </p>
            <p className="text-xs text-slate-400 mt-1">Totalmente confidencial</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedTurno}
              onChange={(e) => {
                const turno = e.target.value;
                setSelectedTurno(turno);
                localStorage.setItem('xdenker_turno', turno);
              }}
              className="border-2 border-amber-400 rounded-lg px-3 py-2 text-sm font-semibold bg-white text-slate-800 min-w-[5.5rem]"
            >
              <option value="1">1º Turno</option>
              <option value="2">2º Turno</option>
            </select>

            <label className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-medium">Seu estado</span>
              <select
                value={selectedUF}
                onChange={(e) => {
                  const uf = e.target.value;
                  setSelectedUF(uf);
                  localStorage.setItem('xdenker_uf', uf);
                }}
                className="border-2 border-amber-400 rounded-lg px-3 py-2 text-sm font-semibold bg-white text-slate-800 min-w-[4.5rem]"
              >
                {UFS_BR.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </label>

            {hasVoted ? (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-2.5 text-sm font-medium">
                <CheckCircle2 size={18} />
                Você já participou!
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartQuestionnaire}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full px-5 py-2.5 text-sm transition-colors"
              >
                <Play size={16} fill="currentColor" />
                Iniciar Questionário
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}