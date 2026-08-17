import { apiFetch } from '../../api';
import { useEffect, useState } from 'react';

export default function AdminPerguntas() {
  const [questions, setQuestions] = useState([]);
  const [msg, setMsg] = useState('');

  const load = () => {
    apiFetch('/api/admin/questions')
      .then((r) => r.json())
      .then((d) => setQuestions(d.questions || []));
  };

  useEffect(() => { load(); }, []);

  const updateField = (idx, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: Date.now(), text: '', correctAnswer: true, active: true },
    ]);
  };

  const remove = (idx) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = async () => {
    const res = await apiFetch('/api/admin/questions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions }),
    });
    const data = await res.json();
    setMsg(data.message || 'Salvo');
    setQuestions(data.questions || questions);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Perguntas — Competência Institucional</h2>
          <p className="text-sm text-slate-500">
            Aparecem na Etapa 1 do questionário. A resposta correta alimenta o índice de conhecimento.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addQuestion}
            className="border border-slate-300 text-slate-700 text-sm px-4 py-2 rounded-lg"
          >
            + Nova
          </button>
          <button
            type="button"
            onClick={save}
            className="bg-slate-800 text-white text-sm px-4 py-2 rounded-lg font-medium"
          >
            Salvar tudo
          </button>
        </div>
      </div>

      {msg && <p className="text-sm text-green-600 mb-4">{msg}</p>}

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex gap-3 items-start">
              <span className="text-sm font-bold text-slate-400 mt-2 w-6">{idx + 1}.</span>
              <div className="flex-1 space-y-2">
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={q.text}
                  onChange={(e) => updateField(idx, 'text', e.target.value)}
                  placeholder="Texto da pergunta"
                />
                <div className="flex flex-wrap gap-4 items-center text-sm">
                  <label className="flex items-center gap-2">
                    Resposta correta:
                    <select
                      className="border rounded-lg px-2 py-1"
                      value={q.correctAnswer ? 'true' : 'false'}
                      onChange={(e) =>
                        updateField(idx, 'correctAnswer', e.target.value === 'true')
                      }
                    >
                      <option value="true">Sim (Verdadeiro)</option>
                      <option value="false">Não (Falso)</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={q.active !== false}
                      onChange={(e) => updateField(idx, 'active', e.target.checked)}
                    />
                    Ativa
                  </label>
                  <button
                    type="button"
                    className="text-red-600 text-xs ml-auto"
                    onClick={() => remove(idx)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
