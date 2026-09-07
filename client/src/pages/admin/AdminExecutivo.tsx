// src/pages/admin/AdminExecutivo.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const ESPECTROS = ['Esquerda', 'Centro-Esquerda', 'Centro', 'Centro-Direita', 'Direita'];
const CARGOS = ['Presidente', 'Vice-Presidente', 'Ministro'];

const vazio = {
  nome: '',
  cargo: 'Ministro',
  pasta: '',
  partido: '',
  espectro: 'Centro',
  foto_url: '',
  indicado_por: '',
  data_inicio: '',
  data_fim: '',
  ordem: 0,
  ativo: true,
};

export default function AdminExecutivo() {
  const [lista, setLista] = useState<any[]>([]);
  const [form, setForm] = useState({ ...vazio });
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('executivo')
      .select('*')
      .order('ordem', { ascending: true });
    if (error) setMsg('Erro: ' + error.message);
    else setLista(data || []);
    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      data_inicio: form.data_inicio || null,
      data_fim: form.data_fim || null,
      ordem: Number(form.ordem) || 0,
    };

    if (editId) {
      const { error } = await supabase.from('executivo').update(payload).eq('id', editId);
      if (error) setMsg('Erro ao atualizar: ' + error.message);
      else setMsg('Atualizado com sucesso');
    } else {
      const { error } = await supabase.from('executivo').insert(payload);
      if (error) setMsg('Erro ao criar: ' + error.message);
      else setMsg('Criado com sucesso');
    }
    setForm({ ...vazio });
    setEditId(null);
    carregar();
  };

  const editar = (item: any) => {
    setEditId(item.id);
    setForm({
      nome: item.nome || '',
      cargo: item.cargo || 'Ministro',
      pasta: item.pasta || '',
      partido: item.partido || '',
      espectro: item.espectro || 'Centro',
      foto_url: item.foto_url || '',
      indicado_por: item.indicado_por || '',
      data_inicio: item.data_inicio || '',
      data_fim: item.data_fim || '',
      ordem: item.ordem || 0,
      ativo: item.ativo ?? true,
    });
  };

  const excluir = async (id: string) => {
    if (!confirm('Excluir este registro?')) return;
    await supabase.from('executivo').delete().eq('id', id);
    carregar();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Executivo Federal</h2>
        <p className="text-sm text-slate-500">Presidente, Vice-Presidente e Ministros</p>
        {msg && <p className="mt-2 text-sm text-green-600">{msg}</p>}
      </div>

      <form onSubmit={salvar} className="bg-white rounded-xl border p-5 grid sm:grid-cols-3 gap-3">
        <input required placeholder="Nome" className="border rounded-lg px-3 py-2 text-sm"
          value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <select className="border rounded-lg px-3 py-2 text-sm" value={form.cargo}
          onChange={(e) => setForm({ ...form, cargo: e.target.value })}>
          {CARGOS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input placeholder="Pasta (só Ministro)" className="border rounded-lg px-3 py-2 text-sm"
          value={form.pasta} onChange={(e) => setForm({ ...form, pasta: e.target.value })} />
        <input placeholder="Partido" className="border rounded-lg px-3 py-2 text-sm"
          value={form.partido} onChange={(e) => setForm({ ...form, partido: e.target.value })} />
        <select className="border rounded-lg px-3 py-2 text-sm" value={form.espectro}
          onChange={(e) => setForm({ ...form, espectro: e.target.value })}>
          {ESPECTROS.map((e) => <option key={e}>{e}</option>)}
        </select>
        <input placeholder="Ordem" type="number" className="border rounded-lg px-3 py-2 text-sm"
          value={form.ordem} onChange={(e) => setForm({ ...form, ordem: e.target.value as any })} />
        <input placeholder="Indicado por" className="border rounded-lg px-3 py-2 text-sm"
          value={form.indicado_por} onChange={(e) => setForm({ ...form, indicado_por: e.target.value })} />
        <input type="date" className="border rounded-lg px-3 py-2 text-sm"
          value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
        <input type="date" className="border rounded-lg px-3 py-2 text-sm"
          value={form.data_fim} onChange={(e) => setForm({ ...form, data_fim: e.target.value })} />
        <div className="sm:col-span-3 flex gap-2">
          <button type="submit" className="bg-slate-800 text-white rounded-lg text-sm font-medium px-4 py-2">
            {editId ? 'Atualizar' : '+ Adicionar'}
          </button>
          {editId && (
            <button type="button" className="text-sm text-slate-500" onClick={() => { setEditId(null); setForm({ ...vazio }); }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Carregando...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b bg-slate-50">
                <th className="py-2 px-4">Nome</th>
                <th>Cargo</th>
                <th>Pasta</th>
                <th>Partido</th>
                <th>Espectro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-2.5 px-4 font-medium">{item.nome}</td>
                  <td>{item.cargo}</td>
                  <td>{item.pasta || '—'}</td>
                  <td>{item.partido || '—'}</td>
                  <td>{item.espectro || '—'}</td>
                  <td className="text-right px-4 space-x-2">
                    <button type="button" className="text-blue-600 text-xs" onClick={() => editar(item)}>Editar</button>
                    <button type="button" className="text-red-600 text-xs" onClick={() => excluir(item.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
