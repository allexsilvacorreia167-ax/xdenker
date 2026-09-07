// src/pages/admin/AdminJudiciario.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronRight, ChevronDown } from 'lucide-react';

const ORGAOS = ['STF', 'STJ', 'TSE', 'TST', 'STM', 'PF', 'CGU', 'AGU', 'PGR'];
const ESPECTROS = ['Esquerda', 'Centro-Esquerda', 'Centro', 'Centro-Direita', 'Direita'];

const vazio = {
  nome: '',
  orgao: 'STF',
  cargo: 'Ministro',
  partido: '',
  espectro: '',
  foto_url: '',
  indicado_por: '',
  data_inicio: '',
  data_fim: '',
  turma: '',
  origem: '',
  patente: '',
  forca: '',
  ordem: 0,
  ativo: true,
};

export default function AdminJudiciario() {
  const [orgaoAtivo, setOrgaoAtivo] = useState('STF');
  const [lista, setLista] = useState<any[]>([]);
  const [form, setForm] = useState({ ...vazio });
  const [editId, setEditId] = useState<string | null>(null);
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  const carregar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('judiciario')
      .select('*')
      .eq('orgao', orgaoAtivo)
      .order('ordem', { ascending: true });
    if (error) setMsg('Erro: ' + error.message);
    else setLista(data || []);
    setLoading(false);
  };

  useEffect(() => { carregar(); }, [orgaoAtivo]);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      orgao: orgaoAtivo,
      data_inicio: form.data_inicio || null,
      data_fim: form.data_fim || null,
      ordem: Number(form.ordem) || 0,
    };

    if (editId) {
      const { error } = await supabase.from('judiciario').update(payload).eq('id', editId);
      if (error) setMsg('Erro: ' + error.message);
      else setMsg('Atualizado');
    } else {
      const { error } = await supabase.from('judiciario').insert(payload);
      if (error) setMsg('Erro: ' + error.message);
      else setMsg('Criado');
    }
    setForm({ ...vazio });
    setEditId(null);
    setMostrarForm(false);
    carregar();
  };

  const editar = (item: any) => {
    setEditId(item.id);
    setForm({
      nome: item.nome || '',
      orgao: item.orgao || orgaoAtivo,
      cargo: item.cargo || 'Ministro',
      partido: item.partido || '',
      espectro: item.espectro || '',
      foto_url: item.foto_url || '',
      indicado_por: item.indicado_por || '',
      data_inicio: item.data_inicio || '',
      data_fim: item.data_fim || '',
      turma: item.turma || '',
      origem: item.origem || '',
      patente: item.patente || '',
      forca: item.forca || '',
      ordem: item.ordem || 0,
      ativo: item.ativo ?? true,
    });
    setMostrarForm(true);
    setAbertoId(null);
  };

  const excluir = async (id: string) => {
    if (!confirm('Excluir?')) return;
    await supabase.from('judiciario').delete().eq('id', id);
    carregar();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Judiciário</h2>
          <p className="text-sm text-slate-500">STF, STJ, TSE, TST, STM e Órgãos de Controle</p>
        </div>
        <button type="button" onClick={() => { setMostrarForm(true); setEditId(null); setForm({ ...vazio, orgao: orgaoAtivo }); }}
          className="bg-slate-800 text-white rounded-lg text-sm font-medium px-4 py-2">
          + Novo
        </button>
      </div>
      {msg && <p className="text-sm text-green-600">{msg}</p>}

      {/* Abas de órgão */}
      <div className="flex flex-wrap gap-2">
        {ORGAOS.map((o) => (
          <button key={o} type="button" onClick={() => setOrgaoAtivo(o)}
            className={"px-3 py-1.5 rounded-lg text-sm font-medium " + (orgaoAtivo === o ? "bg-slate-800 text-white" : "bg-white border text-slate-600 hover:bg-slate-50")}>
            {o}
          </button>
        ))}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <form onSubmit={salvar} className="bg-white rounded-xl border p-5 grid sm:grid-cols-3 gap-3">
          <input required placeholder="Nome" className="border rounded-lg px-3 py-2 text-sm"
            value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <input placeholder="Cargo (Presidente, Ministro...)" className="border rounded-lg px-3 py-2 text-sm"
            value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
          <input placeholder="Indicado por" className="border rounded-lg px-3 py-2 text-sm"
            value={form.indicado_por} onChange={(e) => setForm({ ...form, indicado_por: e.target.value })} />
          <input type="date" className="border rounded-lg px-3 py-2 text-sm" title="Data início"
            value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
          <input type="date" className="border rounded-lg px-3 py-2 text-sm" title="Data fim prevista"
            value={form.data_fim} onChange={(e) => setForm({ ...form, data_fim: e.target.value })} />
          <input placeholder="Turma (1ª / 2ª)" className="border rounded-lg px-3 py-2 text-sm"
            value={form.turma} onChange={(e) => setForm({ ...form, turma: e.target.value })} />
          <input placeholder="Origem (Advogado, Juiz...)" className="border rounded-lg px-3 py-2 text-sm"
            value={form.origem} onChange={(e) => setForm({ ...form, origem: e.target.value })} />
          <input placeholder="Patente (só STM)" className="border rounded-lg px-3 py-2 text-sm"
            value={form.patente} onChange={(e) => setForm({ ...form, patente: e.target.value })} />
          <input placeholder="Força (Exército/Marinha/Aeronáutica)" className="border rounded-lg px-3 py-2 text-sm"
            value={form.forca} onChange={(e) => setForm({ ...form, forca: e.target.value })} />
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.espectro}
            onChange={(e) => setForm({ ...form, espectro: e.target.value })}>
            <option value="">Sem espectro</option>
            {ESPECTROS.map((e) => <option key={e}>{e}</option>)}
          </select>
          <input placeholder="Ordem" type="number" className="border rounded-lg px-3 py-2 text-sm"
            value={form.ordem} onChange={(e) => setForm({ ...form, ordem: e.target.value as any })} />
          <div className="sm:col-span-3 flex gap-2">
            <button type="submit" className="bg-slate-800 text-white rounded-lg text-sm font-medium px-4 py-2">
              {editId ? 'Atualizar' : 'Salvar'}
            </button>
            <button type="button" className="text-sm text-slate-500" onClick={() => { setMostrarForm(false); setEditId(null); }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista com sanfona */}
      <div className="space-y-2">
        {loading ? (
          <div className="bg-white rounded-xl border p-8 text-center text-slate-400 text-sm">Carregando...</div>
        ) : lista.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-slate-400 text-sm">
            Nenhum registro em {orgaoAtivo}. Clique em + Novo para cadastrar.
          </div>
        ) : (
          lista.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border overflow-hidden">
              <button type="button" onClick={() => setAbertoId(abertoId === item.id ? null : item.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  {(item.nome || '?').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 truncate">{item.nome}</div>
                  <div className="text-xs text-slate-500">{item.cargo}{item.turma ? ` • ${item.turma}` : ''}</div>
                </div>
                {abertoId === item.id ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
              </button>

              {abertoId === item.id && (
                <div className="border-t bg-slate-50 p-4 text-sm space-y-1">
                  <div><span className="text-slate-500">Indicado por:</span> {item.indicado_por || '—'}</div>
                  <div><span className="text-slate-500">Entrada:</span> {item.data_inicio || '—'}</div>
                  <div><span className="text-slate-500">Saída prevista:</span> {item.data_fim || '—'}</div>
                  <div><span className="text-slate-500">Origem:</span> {item.origem || '—'}</div>
                  {item.patente && <div><span className="text-slate-500">Patente:</span> {item.patente}</div>}
                  {item.forca && <div><span className="text-slate-500">Força:</span> {item.forca}</div>}
                  <div className="pt-2 flex gap-3">
                    <button type="button" className="text-blue-600 text-xs" onClick={() => editar(item)}>Editar</button>
                    <button type="button" className="text-red-600 text-xs" onClick={() => excluir(item.id)}>Excluir</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
