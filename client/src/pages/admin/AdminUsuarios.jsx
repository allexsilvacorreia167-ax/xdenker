import { supabase } from '../../lib/supabase';
import { useEffect, useState, useMemo } from 'react';

export default function AdminUsuarios() {
  const [users, setUsers] = useState([]);
  const [busca, setBusca] = useState('');
  const [msg, setMsg] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [expandedIds, setExpandedIds] = useState({});
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    token: '',
    token_used: false,
    has_completed_survey: false
  });

  const load = async () => {
    setMsg('');
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setMsg('Erro ao carregar usuários: ' + error.message);
    } else {
      setUsers(data || []);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = (idx, field, value) => {
    setUsers((prev) =>
      prev.map((u, i) => (i === idx ? { ...u, [field]: value } : u))
    );
  };

  const toggleAccordion = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const saveUser = async (user) => {
    const { error } = await supabase
      .from('app_users')
      .update({
        full_name: user.full_name,
        email: user.email,
        token: user.token,
        token_used: user.token_used,
        has_completed_survey: user.has_completed_survey
      })
      .eq('id', user.id);

    if (error) {
      setMsg('Erro ao salvar alterações: ' + error.message);
    } else {
      setMsg(`Usuário ${user.full_name || user.email} atualizado com sucesso!`);
      load();
    }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${name || 'Sem Nome'}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    const { error } = await supabase
      .from('app_users')
      .delete()
      .eq('id', id);

    if (error) {
      setMsg('Erro ao excluir usuário: ' + error.message);
    } else {
      setMsg('Usuário excluído com sucesso!');
      load();
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (!newUser.full_name.trim() || !newUser.email.trim()) {
      setMsg('Nome e E-mail são obrigatórios.');
      return;
    }

    const { error } = await supabase.from('app_users').insert([
      {
        full_name: newUser.full_name.trim(),
        email: newUser.email.trim(),
        token: newUser.token.trim(),
        token_used: newUser.token_used,
        has_completed_survey: newUser.has_completed_survey
      }
    ]);

    if (error) {
      setMsg('Erro ao criar usuário: ' + error.message);
    } else {
      setMsg('Usuário criado com sucesso!');
      setIsCreating(false);
      setNewUser({
        full_name: '',
        email: '',
        token: '',
        token_used: false,
        has_completed_survey: false
      });
      load();
    }
  };

  const usuariosFiltrados = useMemo(() => {
    if (!busca.trim()) return users;
    const termo = busca.toLowerCase();
    return users.filter(
      (u) =>
        (u.full_name && u.full_name.toLowerCase().includes(termo)) ||
        (u.email && u.email.toLowerCase().includes(termo))
    );
  }, [users, busca]);

  const usuariosExibidos = busca.trim() ? usuariosFiltrados : usuariosFiltrados.slice(0, 7);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Usuários Cadastrados</h2>
          <p className="text-sm text-slate-500">
            {users.length} usuário(s) no total. Exibindo os 7 primeiros (use a busca para encontrar outros).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="bg-slate-800 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-slate-700"
          >
            {isCreating ? 'Fechar formulário' : '+ Novo Usuário'}
          </button>
          <button
            type="button"
            onClick={load}
            className="border border-slate-300 text-slate-700 text-sm px-4 py-2 rounded-lg hover:bg-slate-50"
          >
            Atualizar
          </button>
        </div>
      </div>

      {msg && <p className="text-sm font-medium text-slate-600 bg-slate-100 p-3 rounded-lg border">{msg}</p>}

      <div className="bg-white rounded-xl border p-4 flex gap-3 shadow-sm">
        <input
          placeholder="Buscar usuário por nome ou e-mail..."
          className="border rounded-lg px-3 py-2 text-sm flex-1 outline-none focus:border-slate-500"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        {busca && (
          <button
            type="button"
            onClick={() => setBusca('')}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 font-medium"
          >
            Limpar busca
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={createUser} className="bg-white rounded-xl border border-slate-300 p-5 space-y-4 shadow-md">
          <h3 className="font-bold text-slate-700 text-sm">Adicionar Novo Usuário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nome Completo</label>
              <input
                required
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                placeholder="Ex: João da Silva"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">E-mail</label>
              <input
                required
                type="email"
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Token</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm font-mono bg-white"
                value={newUser.token}
                onChange={(e) => setNewUser({ ...newUser, token: e.target.value })}
                placeholder="TKN-XXXX"
              />
            </div>
            <div className="flex items-center gap-6 pt-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={newUser.token_used}
                  onChange={(e) => setNewUser({ ...newUser, token_used: e.target.checked })}
                />
                Token Usado
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={newUser.has_completed_survey}
                  onChange={(e) => setNewUser({ ...newUser, has_completed_survey: e.target.checked })}
                />
                Pesquisa Concluída
              </label>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Salvar Novo Usuário
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {usuariosExibidos.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
            Nenhum usuário encontrado.
          </div>
        ) : (
          usuariosExibidos.map((u, idx) => {
            const isOpen = !!expandedIds[u.id];
            return (
              <div key={u.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                <div
                  onClick={() => toggleAccordion(u.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 select-none bg-white"
                >
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <span className="text-slate-500 font-bold text-base transition-transform">
                      {isOpen ? '↓' : '→'}
                    </span>
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 text-sm mr-2">
                        {u.full_name || 'Sem Nome'}
                      </span>
                      <span className="text-slate-400 text-xs">
                        ({u.email || 'Sem E-mail'})
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {isOpen ? 'Recolher' : 'Expandir'}
                  </div>
                </div>

                {isOpen && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Nome Completo (`full_name`)</label>
                        <input
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                          value={u.full_name || ''}
                          onChange={(e) => updateField(idx, 'full_name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">E-mail (`email`)</label>
                        <input
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                          value={u.email || ''}
                          onChange={(e) => updateField(idx, 'email', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Token (`token`)</label>
                        <input
                          className="w-full border rounded-lg px-3 py-2 text-sm font-mono bg-white"
                          value={u.token || ''}
                          onChange={(e) => updateField(idx, 'token', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-6 pt-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={u.token_used || false}
                            onChange={(e) => updateField(idx, 'token_used', e.target.checked)}
                          />
                          Token Usado (`token_used`)
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={u.has_completed_survey || false}
                            onChange={(e) => updateField(idx, 'has_completed_survey', e.target.checked)}
                          />
                          Questionário Concluído (`has_completed_survey`)
                        </label>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => deleteUser(u.id, u.full_name)}
                          className="bg-red-50 text-red-600 border border-red-200 text-sm px-4 py-2 rounded-lg font-medium hover:bg-red-100 shadow-sm"
                        >
                          Excluir
                        </button>
                        <button
                          type="button"
                          onClick={() => saveUser(u)}
                          className="bg-slate-800 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-slate-700 shadow-sm"
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}