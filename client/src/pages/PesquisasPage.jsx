import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

const BAR_COLORS = [
  '#1e293b',
  '#f59e0b',
  '#2563eb',
  '#059669',
  '#f43f5e',
  '#7c3aed',
];

const SECTOR_LABELS = {
  seguranca: 'Segurança Pública',
  saude: 'Saúde',
  educacao: 'Educação',
  economia: 'Economia e Emprego',
  infraestrutura: 'Infraestrutura',
  combateCorrupcao: 'Combate à Corrupção',
};

function HorizontalBars({ items, emptyText }) {
  if (!items?.length) {
    return <p className="text-sm text-slate-400 py-4">{emptyText}</p>;
  }
  const hasVotes = items.some((c) => (c.votes || 0) > 0 || (c.percent || 0) > 0);

  return (
    <div className="space-y-3">
      {items.map((c, i) => (
        <div key={c.id || c.key || i}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-slate-700">
              {c.name || c.label}
              {c.party ? ` (${c.party})` : ''}
            </span>
            <span className="font-bold text-slate-800">
              {c.percent}%
              {typeof c.votes === 'number' ? (
                <span className="text-slate-400 font-normal text-xs ml-1">
                  ({c.votes} voto{c.votes !== 1 ? 's' : ''})
                </span>
              ) : null}
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, c.percent || 0)}%`,
                backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                minWidth: c.percent > 0 ? '4px' : '0',
              }}
            />
          </div>
        </div>
      ))}
      {!hasVotes && (
        <p className="text-xs text-slate-400">Aguardando primeiras pesquisas — tudo em 0%</p>
      )}
    </div>
  );
}

export default function PesquisasPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await apiFetch('/api/pesquisas');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-slate-400">
        Carregando resultados...
      </div>
    );
  }

  const total = data?.totalParticipants ?? 0;
  const president = data?.intentionLines?.presidente || [];
  const governor = data?.intentionLines?.governador?.CE || data?.intentionLines?.governador || [];
  const govList = Array.isArray(governor) ? governor : [];
  const knowledge = data?.politicalKnowledgeIndex ?? 0;
  const sectors = data?.sectorEvaluation || {};

  const sectorItems = Object.entries(SECTOR_LABELS).map(([key, label]) => ({
    key,
    label,
    percent: sectors[key] ?? 0,
  }));

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="XDENKER" className="h-9 w-auto object-contain" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">Pesquisas</h1>
            <p className="text-sm text-slate-500">
              Resultados em tempo real ·{' '}
              <strong>{total.toLocaleString('pt-BR')}</strong> participante
              {total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Presidente — uma barra por candidato */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-slate-800 mb-4">
            Intenção de Voto — Presidente
          </h2>
          <HorizontalBars
            items={president}
            emptyText="Nenhum candidato a presidente cadastrado no ADM"
          />
        </section>

        {/* Governador — uma barra por candidato */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-slate-800 mb-4">
            Intenção de Voto — Governador (CE)
          </h2>
          <HorizontalBars
            items={govList}
            emptyText="Nenhum candidato a governador cadastrado no ADM"
          />
        </section>

        {/* Conhecimento político */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-slate-800 mb-2">
            Índice de Conhecimento Político
          </h2>
          <p className="text-3xl font-bold text-slate-800 mb-2">{knowledge}%</p>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${knowledge}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Média de acertos nas perguntas de competência institucional
            {total === 0 ? ' (sem pesquisas ainda)' : ''}
          </p>
        </section>

        {/* Áreas prioritárias — em português */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-slate-800 mb-1">
            Avaliação das Áreas Prioritárias
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Média das respostas (Ruim=25 · Médio=50 · Bom=75 · Excelente=100)
          </p>
          <HorizontalBars
            items={sectorItems}
            emptyText="Sem avaliações ainda"
          />
        </section>

        {total === 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            <strong>Ainda não há pesquisas registradas.</strong> Faça login com
            e-mails diferentes, complete o questionário e os percentuais serão
            calculados automaticamente (ex.: 6 em 10 votos = 60%).
          </div>
        )}
      </div>
    </div>
  );
}
