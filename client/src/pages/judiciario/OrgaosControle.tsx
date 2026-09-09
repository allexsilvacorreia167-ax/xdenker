// src/pages/judiciario/Controle.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { buscarOrgaosControle } from "../../services/politicaService";

const ORGAOS_META: Record<string, { nome: string; descricao: string }> = {
  PF: {
    nome: "Polícia Federal",
    descricao: "Investigação de crimes federais, combate ao crime organizado, corrupção e crimes fronteiriços.",
  },
  CGU: {
    nome: "Controladoria-Geral da União (CGU)",
    descricao: "Controle interno do Governo Federal. Fiscaliza o uso de recursos públicos e combate a corrupção.",
  },
  AGU: {
    nome: "Advocacia-Geral da União (AGU)",
    descricao: "Representa a União em processos judiciais e extrajudiciais. Defende os interesses do Estado.",
  },
  PGR: {
    nome: "Procuradoria-Geral da República (PGR)",
    descricao: "Chefe do Ministério Público Federal. Atua na defesa da ordem jurídica e dos interesses sociais.",
  },
};

export default function Controle() {
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [orgaoAberto, setOrgaoAberto] = useState<string | null>("PF");

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        setLista((await buscarOrgaosControle()) || []);
      } catch (e) {
        console.error("Erro ao carregar órgãos de controle:", e);
        setLista([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const porOrgao = (sigla: string) =>
    lista.filter((p) => (p.orgao || "").toUpperCase() === sigla);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link to="/judiciario" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
          ← Voltar ao Judiciário
        </Link>
        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-3">
          Órgãos de Controle e Investigação
        </h1>

        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { to: "/judiciario", label: "Visão Geral" },
            { to: "/judiciario/stf", label: "STF" },
            { to: "/judiciario/stj", label: "STJ" },
            { to: "/judiciario/tse", label: "TSE" },
            { to: "/judiciario/tst", label: "TST" },
            { to: "/judiciario/stm", label: "STM" },
            { to: "/judiciario/controle", label: "Órgãos de Controle", active: true },
          ].map((tab) => (
            <Link key={tab.to} to={tab.to}
              className={"flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors " + (tab.active ? "bg-slate-800 text-white" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300")}>
              {tab.label}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border p-8 text-center text-slate-400 text-sm">
            Carregando...
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(ORGAOS_META).map(([sigla, meta]) => {
              const membros = porOrgao(sigla);
              const aberto = orgaoAberto === sigla;
              return (
                <section
                  key={sigla}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOrgaoAberto(aberto ? null : sigla)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left hover:bg-slate-50"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-800">
                        {sigla} — {meta.nome}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {membros.length} pessoa(s) cadastrada(s)
                      </div>
                    </div>
                    {aberto ? (
                      <ChevronDown size={18} className="text-slate-400" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-400" />
                    )}
                  </button>

                  {aberto && (
                    <div className="px-4 md:px-6 pb-5 border-t border-slate-100">
                      <p className="text-xs md:text-sm text-slate-600 mt-3 mb-4">
                        {meta.descricao}
                      </p>
                      {membros.length === 0 ? (
                        <div className="text-xs text-slate-400 border border-dashed rounded-xl p-4 text-center">
                          Ninguém cadastrado para {sigla}. Use o Admin → Judiciário.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {membros.map((p) => (
                            <div
                              key={p.id}
                              className="border border-slate-200 rounded-xl overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setAbertoId(abertoId === p.id ? null : p.id)
                                }
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 text-left"
                              >
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                  {(p.nome || "?").charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-slate-800 truncate">
                                    {p.nome}
                                  </div>
                                  <div className="text-xs text-slate-500 truncate">
                                    {p.cargo}
                                  </div>
                                </div>
                                {abertoId === p.id ? (
                                  <ChevronDown size={18} className="text-slate-400" />
                                ) : (
                                  <ChevronRight size={18} className="text-slate-400" />
                                )}
                              </button>
                              {abertoId === p.id && (
                                <div className="px-4 pb-4 border-t bg-slate-50 text-xs md:text-sm text-slate-700 space-y-1.5">
                                  {p.indicado_por && (
                                    <div className="mt-3">
                                      <span className="text-slate-400">Indicado por: </span>
                                      {p.indicado_por}
                                    </div>
                                  )}
                                  {p.data_inicio && (
                                    <div>
                                      <span className="text-slate-400">Início: </span>
                                      {p.data_inicio}
                                    </div>
                                  )}
                                  {p.data_fim && (
                                    <div>
                                      <span className="text-slate-400">Fim: </span>
                                      {p.data_fim}
                                    </div>
                                  )}
                                  {!p.indicado_por && !p.data_inicio && (
                                    <div className="mt-3 text-slate-400">
                                      Sem detalhes adicionais.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
