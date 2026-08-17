import { apiFetch } from '../../api';
import { useEffect, useState } from 'react';

const emptyPres = { name: '', party: 'PT', number: '', active: true };
const emptyGov = { name: '', party: 'PT', number: '', active: true, stateUF: 'CE' };

export default function AdminCandidatos() {
  const [president, setPresident] = useState([]);
  const [governor, setGovernor] = useState({});
  const [parties, setParties] = useState([]);
  const [formPres, setFormPres] = useState(emptyPres);
  const [formGov, setFormGov] = useState(emptyGov);
  const [editingPres, setEditingPres] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => {
    apiFetch('/api/admin/candidates')
      .then((r) => r.json())
      .then((d) => {
        setPresident(d.president || []);
        setGovernor(d.governor || {});
      });
    apiFetch('/api/admin/spectrum')
      .then((r) => r.json())
      .then((d) => setParties(d.parties || []));
  };

  useEffect(() => { load(); }, []);

  const savePresident = async (e) => {
    e.preventDefault();
    const body = editingPres
      ? { ...formPres, position: 'presidente' }
      : { ...formPres, position: 'presidente' };
    const url = editingPres
      ? `/api/admin/candidates/${editingPres}`
      : '/api/admin/candidates';
    const method = editingPres ? 'PUT' : 'POST';
    const res = await apiFetch(url, {
      method,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setMsg(data.message || 'Salvo');
    setFormPres(emptyPres);
    setEditingPres(null);
    load();
  };

  const saveGovernor = async (e) => {
    e.preventDefault();
    const { stateUF, ...rest } = formGov;
    await apiFetch('/api/admin/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rest, position: 'governador', stateUF }),
    });
    setMsg('Governador salvo');
    setFormGov(emptyGov);
    load();
  };

  const remove = async (id, position, stateUF) => {
    if (!confirm('Remover candidato?')) return;
    const q = position === 'governador' ? `?position=governador&stateUF=${stateUF}` : '';
    await apiFetch(`/api/admin/candidates/${id}${q}`, { method: 'DELETE' });
    load();
  };

  const partyOptions = parties.length
    ? parties.map((p) => p.sigla)
    : ['PT', 'PL', 'PDT', 'MDB', 'PSD', 'UNIÃO', 'PSOL', 'NOVO'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Candidatos</h2>
        <p className="text-sm text-slate-500">
          Ativos aparecem nos gráficos e na Etapa 3 do questionário do usuário.
        </p>
        {msg && <p className="mt-2 text-sm text-green-600">{msg}</p>}
      </div>

      {/* Importar do TSE */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="font-semibold text-slate-800 mb-2">Importar candidatos do TSE</h3>
        <p className="text-sm text-slate-600 mb-3">
          Consulta a API DivulgaCandContas e preenche a lista com dados oficiais (ano 2022 como referência até liberação completa de 2026).
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
            onClick={async () => {
              setMsg('Consultando TSE (Presidente)...');
              try {
                const res = await apiFetch('/api/tse/candidatos?year=2022&uf=BR&cargo=presidente');
                const data = await res.json();
                const list = data.candidates || [];
                for (const c of list.slice(0, 30)) {
                  await apiFetch('/api/admin/candidates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      position: 'presidente',
                      name: c.name,
                      party: c.party || 'MDB',
                      number: c.number || '',
                      id: c.id,
                      active: true,
                    }),
                  });
                }
                setMsg(`Importados ${Math.min(list.length, 30)} candidatos a Presidente (fonte: ${data.source})`);
                load();
              } catch (e) {
                setMsg('Falha ao importar do TSE: ' + e.message);
              }
            }}
          >
            Importar Presidentes (TSE)
          </button>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
            onClick={async () => {
              setMsg('Consultando TSE (Governador CE)...');
              try {
                const res = await apiFetch('/api/tse/candidatos?year=2022&uf=CE&cargo=governador');
                const data = await res.json();
                const list = data.candidates || [];
                for (const c of list.slice(0, 30)) {
                  await apiFetch('/api/admin/candidates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      position: 'governador',
                      stateUF: 'CE',
                      name: c.name,
                      party: c.party || 'MDB',
                      number: c.number || '',
                      id: c.id,
                      active: true,
                    }),
                  });
                }
                setMsg(`Importados ${Math.min(list.length, 30)} governadores CE (fonte: ${data.source})`);
                load();
              } catch (e) {
                setMsg('Falha ao importar: ' + e.message);
              }
            }}
          >
            Importar Governadores CE (TSE)
          </button>
        </div>
      </section>

      {/* Presidente */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Presidente da República</h3>
        <form onSubmit={savePresident} className="grid sm:grid-cols-4 gap-3 mb-4">
          <input
            required
            placeholder="Nome"
            className="border rounded-lg px-3 py-2 text-sm"
            value={formPres.name}
            onChange={(e) => setFormPres({ ...formPres, name: e.target.value })}
          />
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={formPres.party}
            onChange={(e) => setFormPres({ ...formPres, party: e.target.value })}
          >
            {partyOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            placeholder="Número"
            className="border rounded-lg px-3 py-2 text-sm"
            value={formPres.number}
            onChange={(e) => setFormPres({ ...formPres, number: e.target.value })}
          />
          <button type="submit" className="bg-slate-800 text-white rounded-lg text-sm font-medium py-2">
            {editingPres ? 'Atualizar' : '+ Adicionar'}
          </button>
        </form>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Nome</th>
              <th>Partido</th>
              <th>Nº</th>
              <th>Ativo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {president.map((c) => (
              <tr key={c.id} className="border-b border-slate-100">
                <td className="py-2.5 font-medium">{c.name}</td>
                <td>{c.party}</td>
                <td>{c.number}</td>
                <td>{c.active ? '✓' : '—'}</td>
                <td className="text-right space-x-2">
                  <button
                    type="button"
                    className="text-blue-600 text-xs"
                    onClick={() => {
                      setEditingPres(c.id);
                      setFormPres({ name: c.name, party: c.party, number: c.number, active: c.active });
                    }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="text-red-600 text-xs"
                    onClick={() => remove(c.id, 'presidente')}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Governador */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Governador (por UF)</h3>
        <form onSubmit={saveGovernor} className="grid sm:grid-cols-5 gap-3 mb-4">
          <input
            required
            placeholder="Nome"
            className="border rounded-lg px-3 py-2 text-sm"
            value={formGov.name}
            onChange={(e) => setFormGov({ ...formGov, name: e.target.value })}
          />
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={formGov.party}
            onChange={(e) => setFormGov({ ...formGov, party: e.target.value })}
          >
            {partyOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            placeholder="Número"
            className="border rounded-lg px-3 py-2 text-sm"
            value={formGov.number}
            onChange={(e) => setFormGov({ ...formGov, number: e.target.value })}
          />
          <input
            placeholder="UF"
            className="border rounded-lg px-3 py-2 text-sm uppercase"
            maxLength={2}
            value={formGov.stateUF}
            onChange={(e) => setFormGov({ ...formGov, stateUF: e.target.value.toUpperCase() })}
          />
          <button type="submit" className="bg-slate-800 text-white rounded-lg text-sm font-medium py-2">
            + Adicionar
          </button>
        </form>
        {Object.entries(governor).map(([uf, list]) => (
          <div key={uf} className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">UF: {uf}</p>
            <table className="w-full text-sm">
              <tbody>
                {list.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100">
                    <td className="py-2 font-medium">{c.name}</td>
                    <td>{c.party}</td>
                    <td>{c.number}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="text-red-600 text-xs"
                        onClick={() => remove(c.id, 'governador', uf)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>
    </div>
  );
}
