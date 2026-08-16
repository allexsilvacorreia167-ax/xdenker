export default function AdminUsuarios() {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Usuários Cadastrados</h2>
      <p className="text-sm text-slate-500 mb-6">
        Auditoria de nome, e-mail, tokens e status de participação.
      </p>
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
        Tabela de usuários será conectada ao banco (PostgreSQL/Supabase) na próxima etapa.
      </div>
    </div>
  );
}
