import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../api';
import { ALL_PARTIES } from '../data/parties';
import { getTseLink } from '../data/tseLinks';

const SCALE = ['Ruim', 'Médio', 'Bom', 'Excelente'];
const SCALE_COLORS = {
  Ruim: 'bg-red-500 text-white',
  Médio: 'bg-amber-200 text-amber-900',
  Bom: 'bg-blue-200 text-blue-900',
  Excelente: 'bg-green-200 text-green-900',
};

const LEGISLATIVE_FIELDS = [
  { key: 'depFederal', label: 'Deputado Federal' },
  { key: 'depEstadual', label: 'Deputado Estadual' },
  { key: 'senador', label: 'Senador' },
];

export default function QuestionarioPage() {
  const selectedUF = localStorage.getItem('xdenker_uf') || 'CE';
  const selectedTurno = localStorage.getItem('xdenker_turno') || '1';
  const { isAuthenticated, user, token } = useAuth();
  const navigate = useNavigate();
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(null);
  const [institutional, setInstitutional] = useState({});
  const [sectors, setSectors] = useState({});
  const [presidentId, setPresidentId] = useState(null);
  const [governorId, setGovernorId] = useState(null);

  // Campos manuais: { name, party }
  const [depFederal, setDepFederal] = useState({ name: '', party: '' });
  const [depEstadual, setDepEstadual] = useState({ name: '', party: '' });
  const [senador, setSenador] = useState({ name: '', party: '' });

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const tseLink = getTseLink(selectedUF);

  const legislativeSetters = {
    depFederal: [depFederal, setDepFederal],
    depEstadual: [depEstadual, setDepEstadual],
    senador: [senador, setSenador],
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/');
      return;
    }
    apiFetch('/api/research/start', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stateUF: selectedUF, turno: selectedTurno }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok || data.hasCompleted) {
          alert(data.error || 'Você já participou desta pesquisa.');
          navigate('/');
          return;
        }
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch(() => {
        alert('Erro ao iniciar questionário. Verifique se o servidor está rodando.');
        setLoading(false);
        navigate('/');
      });
  }, [isAuthenticated, token, navigate, selectedUF, selectedTurno]);

  const isLegislativeComplete = (field) => field.name.trim() && field.party;

  const handleFinish = async () => {
    if (!presidentId || !governorId) {
      alert('Selecione Presidente e Governador.');
      return;
    }
    if (!isLegislativeComplete(depFederal)) {
      alert('Preencha o nome e o partido do Deputado Federal.');
      return;
    }
    if (!isLegislativeComplete(depEstadual)) {
      alert('Preencha o nome e o partido do Deputado Estadual.');
      return;
    }
    if (!isLegislativeComplete(senador)) {
      alert('Preencha o nome e o partido do Senador.');
      return;
    }

    setSubmitting(true);
    try {
      const institutionalAnswers = Object.entries(institutional).map(([id, answer]) => ({
        id: Number(id),
        answer,
      }));

      const res = await apiFetch('/api/research/calculate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institutionalAnswers,
          sectorAnswers: sectors,
          presidentId,
          governorId,
          stateUF: selectedUF,
          turno: selectedTurno,
          depFederal: { name: depFederal.name.trim(), party: depFederal.party },
          depEstadual: { name: depEstadual.name.trim(), party: depEstadual.party },
          senador: { name: senador.name.trim(), party: senador.party },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      setResult(data);
      setStage(4);
      try {
        const uid = user?.userId || user?.id;
        if (uid) {
          localStorage.setItem(
            `xdenker_coherence_${uid}`,
            JSON.stringify({
              score: data.score,
              label: data.label,
              stateUF: selectedUF,
            })
          );
        }
      } catch (_) { }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-slate-400">Preparando questionário...</div>
      </div>
    );
  }

  // Tela de resultado
  if (stage === 4 && result) {
    const presName =
      questions?.candidates?.president?.find((c) => c.id === presidentId)?.name || presidentId;
    const govName =
      questions?.candidates?.governor?.find((c) => c.id === governorId)?.name || governorId;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📈</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Pesquisa Concluída!</h1>
          <p className="text-slate-500 text-sm mb-6">
            Obrigado por participar, {user?.fullName?.split(' ')[0] || 'eleitor'}!
          </p>

          <div className="bg-green-50 rounded-xl p-5 mb-5">
            <p className="text-4xl font-bold text-green-600 mb-1">{result.score}%</p>
            <p className="text-sm font-medium text-green-700">{result.label}</p>
          </div>

          <div className="text-left space-y-2 text-sm text-slate-600 mb-6">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 uppercase text-xs">Presidente</span>
              <span className="font-medium">{presName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 uppercase text-xs">Governador</span>
              <span className="font-medium">{govName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 uppercase text-xs">Dep. Federal</span>
              <span className="font-medium">{depFederal.name} ({depFederal.party})</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 uppercase text-xs">Dep. Estadual</span>
              <span className="font-medium">{depEstadual.name} ({depEstadual.party})</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 uppercase text-xs">Senador</span>
              <span className="font-medium">{senador.name} ({senador.party})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 uppercase text-xs">Acertos competência</span>
              <span className="font-medium">
                {result.correctCount} / {result.totalQuestions}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Seu voto já atualizou os gráficos da pesquisa
            {result.updatedResults && (
              <> — agora com {result.updatedResults.totalParticipants.toLocaleString('pt-BR')} participantes</>
            )}
            .
          </p>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl"
          >
            🏠 Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Badge etapa */}
        <div className="flex justify-center mb-4">
          <span className="bg-slate-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
            Etapa {stage} de 3
          </span>
        </div>

        {/* ETAPA 1 */}
        {stage === 1 && questions?.institutional && (
          <div>
            <h1 className="text-xl font-bold text-slate-800 text-center mb-1">
              Competência Institucional
            </h1>
            <p className="text-sm text-slate-500 text-center mb-6">
              Responda com base no seu conhecimento sobre os cargos públicos.
            </p>
            <div className="space-y-4">
              {questions.institutional.map((q) => (
                <div key={q.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-800 mb-3">
                    {q.id}. {q.text}
                  </p>
                  <div className="flex gap-2">
                    {[true, false].map((val) => (
                      <button
                        key={String(val)}
                        onClick={() =>
                          setInstitutional((prev) => ({ ...prev, [q.id]: val }))
                        }
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${institutional[q.id] === val
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        {val ? '✓ Sim' : '✗ Não'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (Object.keys(institutional).length < questions.institutional.length) {
                  alert('Responda todas as perguntas.');
                  return;
                }
                setStage(2);
              }}
              className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 rounded-full"
            >
              Próxima Etapa →
            </button>
          </div>
        )}

        {/* ETAPA 2 */}
        {stage === 2 && questions?.sectors && (
          <div>
            <h1 className="text-xl font-bold text-slate-800 text-center mb-1">
              Percepção Social
            </h1>
            <p className="text-sm text-slate-500 text-center mb-6">
              Avalie como você vê cada área abaixo.
            </p>
            <div className="space-y-4">
              {questions.sectors.map((s, idx) => (
                <div key={s.key} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-800 mb-3">
                    {idx + 1}. {s.text}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SCALE.map((label) => (
                      <button
                        key={label}
                        onClick={() =>
                          setSectors((prev) => ({ ...prev, [s.key]: label }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${sectors[s.key] === label
                          ? SCALE_COLORS[label]
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStage(1)}
                className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-full"
              >
                ← Voltar
              </button>
              <button
                onClick={() => {
                  if (Object.keys(sectors).length < questions.sectors.length) {
                    alert('Avalie todas as áreas.');
                    return;
                  }
                  setStage(3);
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-full"
              >
                Próxima Etapa →
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3 */}
        {stage === 3 && questions?.candidates && (
          <div>
            <h1 className="text-xl font-bold text-slate-800 text-center mb-1">Sua Escolha</h1>
            <p className="text-sm text-slate-500 text-center mb-6">
              Selecione seus candidatos para o {selectedTurno}º turno.
            </p>

            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                🏛 Presidente
              </p>
              <div className="space-y-2">
                {questions.candidates.president.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setPresidentId(c.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors ${presidentId === c.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    <div>
                      <p className="font-medium text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.party}</p>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${presidentId === c.id ? 'border-blue-500' : 'border-slate-300'
                        }`}
                    >
                      {presidentId === c.id && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                📍 Governador ({selectedUF})
              </p>
              <div className="space-y-2">
                {questions.candidates.governor.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setGovernorId(c.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors ${governorId === c.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    <div>
                      <p className="font-medium text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.party}</p>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${governorId === c.id ? 'border-green-500' : 'border-slate-300'
                        }`}
                    >
                      {governorId === c.id && (
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legislativo — preenchimento manual (nome + sigla) com atalho para o TSE */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm mb-6 space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Legislativo ({selectedUF})
                </p>
                {tseLink && (
                  <a
                    href={tseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 underline"
                  >
                    Ver candidatos no TSE ↗
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-400 -mt-3">
                Consulte o candidato no site do TSE, depois preencha o nome e selecione o partido abaixo.
                O que você digitou aqui continua salvo mesmo se você sair e voltar do link.
              </p>

              {LEGISLATIVE_FIELDS.map(({ key, label }) => {
                const [value, setValue] = legislativeSetters[key];
                return (
                  <div key={key} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                    <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder={`Nome do candidato a ${label}`}
                        value={value.name}
                        onChange={(e) =>
                          setValue((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={value.party}
                        onChange={(e) =>
                          setValue((prev) => ({ ...prev, party: e.target.value }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">Selecione o partido</option>
                        {ALL_PARTIES.map((p) => (
                          <option key={p.sigla} value={p.sigla}>
                            {p.sigla} — {p.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStage(2)}
                className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-full"
              >
                ← Voltar
              </button>
              <button
                onClick={handleFinish}
                disabled={submitting}
                className="flex-1 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold py-3 rounded-full"
              >
                {submitting ? 'Calculando...' : 'Finalizar e Ver Resultado'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}