import { apiFetch } from '../api';
import { useAuth } from '../hooks/useAuth';
import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrazilMap from '../components/BrazilMap';

/**
 * HOME — mapa do Brasil + turno + iniciar pesquisa
 * Gráficos ficam em /pesquisas
 * Voto de presidente (na pesquisa) vai ao banco e soma na pesquisa NACIONAL
 */
export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [hasVoted, setHasVoted] = useState(false);
  const [respondents, setRespondents] = useState(0);
  const [selectedUF, setSelectedUF] = useState(
    () => localStorage.getItem('xdenker_uf') || ''
  );
  const [selectedTurno, setSelectedTurno] = useState(
    () => localStorage.getItem('xdenker_turno') || '1'
  );

  const userId = user?.userId || user?.id;

  useEffect(() => {
    const load = async () => {
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
      }
    };
    load();
  }, [isAuthenticated, userId, selectedUF, selectedTurno]);

  const handleSelectUF = (uf) => {
    setSelectedUF(uf);
    localStorage.setItem('xdenker_uf', uf);
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
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="text-center pt-5 pb-3 px-4">
        <h1 className="text-base md:text-lg font-bold tracking-wide text-slate-800 uppercase">
          Pesquisa Eleitoral — Eleições 2026
        </h1>
      </div>

      <div className="px-4 md:px-8 mb-4 max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-md">
          <img
            src="/banner.jpg"
            alt="Sua Opinião Importa"
            className="w-full h-auto object-cover aspect-[2.8/1] md:aspect-[3/1]"
          />
        </div>
      </div>

      <div className="px-4 md:px-8 mb-4 max-w-5xl mx-auto">
        <BrazilMap selectedUF={selectedUF} onSelect={handleSelectUF} />
      </div>

      <div className="px-4 md:px-8 mb-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-2 bg-white rounded-2xl border border-slate-100 p-3 shadow-sm">
          <div className="text-center">
            <p className="text-[10px] uppercase text-slate-400 font-semibold">Dados</p>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Tempo real</p>
          </div>
          <div className="text-center border-x border-slate-100">
            <p className="text-[10px] uppercase text-slate-400 font-semibold">Respostas</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{respondents}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase text-slate-400 font-semibold">Percentuais</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">
              {respondents > 0 ? 'Ativos' : '0%'}
            </p>
          </div>
        </div>
      </div>

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
