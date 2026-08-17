import { apiFetch } from '../../api';
import { useEffect, useState } from 'react';

const SPECTRUM_COLORS = {
  Esquerda: 'bg-red-100 text-red-800 border-red-200',
  'Centro-Esquerda': 'bg-orange-100 text-orange-800 border-orange-200',
  Centro: 'bg-slate-100 text-slate-700 border-slate-200',
  'Centro-Direita': 'bg-blue-100 text-blue-800 border-blue-200',
  Direita: 'bg-indigo-100 text-indigo-900 border-indigo-200',
};

export default function AdminEspectro() {
  const [parties, setParties] = useState([]);
  const [options, setOptions] = useState([]);
  const [spectrum, setSpectrum] = useState({});
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState('');

  const load = () => {
    apiFetch('/api/admin/spectrum')
      .then((r) => r.json())
      .then((d) => {
        setParties(d.parties || []);
        setOptions(d.options || []);
        setSpectrum(d.spectrum || {});
      });
  };

  useEffect(() => { load(); }, []);

  const setPartySpectrum = (sigla, value) => {
    setSpectrum((prev) => ({ ...prev, [sigla]: value }));
  };

  const save = async () => {
    const res = await apiFetch('/api/admin/spectrum', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spectrum }),
    });
    const data = await res.json();
    setMsg(data.message || 'Espectro salvo');
    setParties(data.parties || parties);
    setSpectrum(data.spectrum || spectrum);
  };

  const filtered = parties.filter(
    (p) =>
      !filter ||
      p.sigla.toLowerCase().includes(filter.toLowerCase()) ||
      p.nome.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Espectro Político</h2>
          <p className="text-sm text-slate-500 max-w-xl">
            Defina manualmente a posição ideológica de cada partido.
            O sistema cruza a sigla do candidato (Presidente/Governador) com este espectro
            para calcular o índice de coerência política do eleitor.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          className="bg-slate-800 text-white text-sm px-5 py-2.5 rounded-lg font-medium shrink-0"
        >
          Salvar espectro
        </button>
      </div>

      {msg && <p className="text-sm text-green-600 mb-4">{msg}</p>}

      <div className="mb-4">
        <input
          type="search"
          placeholder="Buscar partido ou sigla..."
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm w-full max-w-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map((opt) => (
          <span
            key={opt}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${SPECTRUM_COLORS[opt] || ''}`}
          >
            {opt}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">Sigla</th>
              <th className="px-4 py-3">Partido</th>
              <th className="px-4 py-3">Espectro ideológico</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.sigla} className="border-t border-slate-100">
                <td className="px-4 py-2.5 font-bold text-slate-800">{p.sigla}</td>
                <td className="px-4 py-2.5 text-slate-600">{p.nome}</td>
                <td className="px-4 py-2.5">
                  <select
                    className={`border rounded-lg px-3 py-1.5 text-sm font-medium ${SPECTRUM_COLORS[spectrum[p.sigla] || p.spectrum] || ''
                      }`}
                    value={spectrum[p.sigla] || p.spectrum || 'Centro'}
                    onChange={(e) => setPartySpectrum(p.sigla, e.target.value)}
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        {parties.length} partidos disponíveis (base TSE). O espectro é volátil e controlado apenas por este painel.
      </p>
    </div>
  );
}
