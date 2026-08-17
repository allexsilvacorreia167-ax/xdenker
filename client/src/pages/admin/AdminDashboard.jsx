import { apiFetch } from '../../api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, HelpCircle, Compass, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [snap, setSnap] = useState(null);

  useEffect(() => {
    apiFetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then(setSnap)
      .catch(console.error);
  }, []);

  const cards = [
    {
      title: 'Candidatos Presidente',
      value: snap?.presidentCandidates?.length ?? '—',
      href: '/html/adm/candidatos',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Perguntas Institucionais',
      value: snap?.questions?.length ?? '—',
      href: '/html/adm/perguntas',
      icon: HelpCircle,
      color: 'bg-amber-500',
    },
    {
      title: 'Partidos no Espectro',
      value: snap?.parties?.length ?? '—',
      href: '/html/adm/espectro',
      icon: Compass,
      color: 'bg-green-500',
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Dashboard</h2>
      <p className="text-sm text-slate-500 mb-6">
        Gerencie candidatos, perguntas e espectro. Tudo reflete na pesquisa pública.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              to={c.href}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center text-white`}>
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium text-slate-600">{c.title}</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{c.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <TrendingUp size={18} /> Como funciona a conexão ADM → Usuário
        </h3>
        <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">
          <li>Candidatos ativos aparecem na Etapa 3 do questionário e nos gráficos</li>
          <li>Perguntas editadas aparecem na Etapa 1 (Competência Institucional)</li>
          <li>Espectro por partido alimenta o cálculo de coerência política</li>
          <li>Siglas dos candidatos cruzam com o espectro definido aqui</li>
        </ul>
      </div>
    </div>
  );
}
