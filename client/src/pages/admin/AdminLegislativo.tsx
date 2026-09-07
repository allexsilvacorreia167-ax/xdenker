// src/pages/admin/AdminLegislativo.tsx
// Busca titulares e permite editar partido/espectro + gerenciar suplentes na sanfona
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronRight, ChevronDown } from 'lucide-react';

const ESPECTROS = ['Esquerda', 'Centro-Esquerda', 'Centro', 'Centro-Direita', 'Direita'];
const CARGOS = ['Deputado Federal', 'Deputado Estadual', 'Senador', 'Governador'];

export default function AdminLegislativo() {
  const [busca, setBusca] = useState('');
  const [cargoFiltro, setCargoFiltro] = useState('Deputado Federal');
  const [ufFiltro, setUfFiltro] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [suplentes, setSuplentes] = useState<Record<string, any[]>>({});
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [novoSuplente, setNovoSuplente] = useState({ nome_urna: '', tipo: '1º Suplente', partido: '', espectro: 'Centro' });

  const pesquisar = async () => {
    setLoading(true);
    setMsg('');
    let query = supabase.from('titulares').select('*').eq('ativo', true).limit(50);

    if (cargoFiltro) query = query.eq('cargo', cargoFiltro);
    if (ufFiltro) query = query.eq('uf', ufFiltro.toUpperCase());
    if (busca.trim()) query = query.ilike('nome_urna', `%${busca.trim()}%`);

    const { data, error } = await query.order('nome_urna');
    if (error) setMsg('Erro: ' + error.message);
    else {
      setResultados(data || []);
      setMsg(`${(data || []).length} resultado(s)`);
    }
    setLoading(false);
  };

  const abrirSanfona = async (id: string) => {
    if (abertoId === id) {
      setAbertoId(null);
      return;
    }
    setAbertoId(id);
    const item = resultados.find((r) => r.id === id);
    if (item) {
      setEditForm({
        partido: item.partido || '',
        espectro: item.espectro || 'Centro',
        foto_url: item.foto_url || '',
        status: item.status || 'eleito_agora',
      });
    }
    if (!suplentes[id]) {
      const { data } = await supabase.from('suplentes').select('*').eq('titular_id', id).eq('ativo', true);
      setSuplentes((prev) => ({ ...prev, [id]: data || [] }));
    }
  };

  const salvarTitular = async (id: string) => {
    const { error } = await supabase.from('titulares').update({
      partido: editForm.partido,
      espectro: editForm.espectro,
      foto_url: editForm.foto_url || null,
      status: editForm.status,
      updated_at: new Date().toISOString(),
    }).eq('id', id);

    if (error) setMsg('Erro ao salvar: ' + error.message);
    else {
      setMsg('Salvo com sucesso');
      setResultados((prev) => prev.map((r) => r.id === id ? { ...r, ...editForm } : r));
    }
  };

  const adicionarSuplente = async (titularId: string) => {
    if (!novoSuplente.nome_urna.trim()) return;
    const { error } = await supabase.from('suplentes').insert({
      titular_id: titularId,
      nome_urna: novoSuplente.nome_urna,
      tipo: novoSuplente.tipo,
      partido: novoSuplente.partido,
      espectro: novoSuplente.espectro,
      ativo: true,
    });
    if (error) setMsg('Erro ao adicionar suplente: ' + error.message);
    else {
      setMsg('Suplente adicionado');
      setNovoSuplente({ nome_urna: '', tipo: '1º Suplente', partido: '', espectro: 'Centro' });
      const { data } = await supabase.from('suplentes').select('*').eq('titular_id', titularId).eq('ativo', true);
      setSuplentes((prev) => ({ ...prev, [titularId]: data || [] }));
    }
  };

  const removerSuplente = async (suplenteId: string, titularId: string) => {
    if (!confirm('Remover suplente?')) return;
    await supabase.from('suplentes').delete().eq('id', suplenteId);
    setSuplentes((prev) => ({
      ...prev,
      [titularId]: (prev[titularId] || []).filter((s) => s.id !== suplenteId),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Legislativo</h2>
        <p className="text-sm text-slate-500">
          Pesquise por nome, cargo ou UF. Clique para editar e gerenciar suplentes.
        </p>
        {msg && <p className="mt-2 text-sm text-green-600">{msg}</p>}
      </div>

      {/* Filtros de busca */}
      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-3">
        <input
          placeholder="Buscar por nome..."
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[180px]"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && pesquisar()}
        />
        <select className="border rounded-lg px-3 py-2 text-sm" value={cargoFiltro}
          onChange={(e) => setCargoFiltro(e.target.value)}>
          {CARGOS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input
          placeholder="UF"
          maxLength={2}
          className="border rounded-lg px-3 py-2 text-sm w-20 uppercase"
          value={ufFiltro}
          onChange={(e) => setUfFiltro(e.target.value.toUpperCase())}
        />
        <button type="button" onClick={pesquisar}
          className="bg-slate-800 text-white rounded-lg text-sm font-medium px-4 py-2">
          {loading ? 'Buscando...' : 'Pesquisar'}
        </button>
      </div>

      {/* Resultados com sanfona */}
      <div className="space-y-2">
        {resultados.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border overflow-hidden">
            <button
              type="button"
              onClick={() => abrirSanfona(p.id)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50"
            >
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                {(p.nome_urna || '?').charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 truncate">{p.nome_urna}</div>
                <div className="text-xs text-slate-500">{p.partido} • {p.uf} • {p.cargo} • {p.espectro}</div>
              </div>
              {abertoId === p.id ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
            </button>

            {abertoId === p.id && (
              <div className="border-t bg-slate-50 p-4 space-y-4">
                {/* Edição do titular */}
                <div className="grid sm:grid-cols-4 gap-3">
                  <input placeholder="Partido" className="border rounded-lg px-3 py-2 text-sm"
                    value={editForm.partido || ''} onChange={(e) => setEditForm({ ...editForm, partido: e.target.value })} />
                  <select className="border rounded-lg px-3 py-2 text-sm" value={editForm.espectro || 'Centro'}
                    onChange={(e) => setEditForm({ ...editForm, espectro: e.target.value })}>
                    {ESPECTROS.map((e) => <option key={e}>{e}</option>)}
                  </select>
                  <input placeholder="URL da foto" className="border rounded-lg px-3 py-2 text-sm"
                    value={editForm.foto_url || ''} onChange={(e) => setEditForm({ ...editForm, foto_url: e.target.value })} />
                  <button type="button" onClick={() => salvarTitular(p.id)}
                    className="bg-slate-800 text-white rounded-lg text-sm font-medium py-2">
                    Salvar
                  </button>
                </div>

                {/* Suplentes */}
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Suplentes / Vice</div>
                  {(suplentes[p.id] || []).length > 0 ? (
                    <div className="space-y-1 mb-3">
                      {suplentes[p.id].map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border">
                          <span>
                            <span className="text-slate-400">{s.tipo}:</span>{' '}
                            <span className="font-medium">{s.nome_urna}</span>{' '}
                            <span className="text-slate-400">({s.partido})</span>
                          </span>
                          <button type="button" className="text-red-600 text-xs" onClick={() => removerSuplente(s.id, p.id)}>
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 mb-3">Nenhum suplente cadastrado.</p>
                  )}

                  <div className="grid sm:grid-cols-5 gap-2">
                    <input placeholder="Nome do suplente" className="border rounded-lg px-3 py-2 text-sm"
                      value={novoSuplente.nome_urna} onChange={(e) => setNovoSuplente({ ...novoSuplente, nome_urna: e.target.value })} />
                    <select className="border rounded-lg px-3 py-2 text-sm" value={novoSuplente.tipo}
                      onChange={(e) => setNovoSuplente({ ...novoSuplente, tipo: e.target.value })}>
                      <option>1º Suplente</option>
                      <option>2º Suplente</option>
                      <option>3º Suplente</option>
                      <option>Vice-Governador</option>
                    </select>
                    <input placeholder="Partido" className="border rounded-lg px-3 py-2 text-sm"
                      value={novoSuplente.partido} onChange={(e) => setNovoSuplente({ ...novoSuplente, partido: e.target.value })} />
                    <select className="border rounded-lg px-3 py-2 text-sm" value={novoSuplente.espectro}
                      onChange={(e) => setNovoSuplente({ ...novoSuplente, espectro: e.target.value })}>
                      {ESPECTROS.map((e) => <option key={e}>{e}</option>)}
                    </select>
                    <button type="button" onClick={() => adicionarSuplente(p.id)}
                      className="bg-blue-600 text-white rounded-lg text-sm font-medium py-2">
                      + Suplente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {!loading && resultados.length === 0 && (
          <div className="bg-white rounded-xl border p-8 text-center text-slate-400 text-sm">
            Use a busca acima para encontrar políticos.
          </div>
        )}
      </div>
    </div>
  );
}
