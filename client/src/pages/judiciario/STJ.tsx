// src/pages/judiciario/STJ.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { buscarSTJ } from "../../services/politicaService";

const competenciasSTJ = [
  "Uniformizar a interpretação da lei federal em todo o Brasil",
  "Julgar Recursos Especiais contra decisões de Tribunais de Justiça e Tribunais Regionais Federais",
  "Processar e julgar Governadores dos Estados e do Distrito Federal em crimes comuns",
  "Julgar habeas corpus e mandados de segurança em casos previstos na Constituição",
  "Decidir conflitos de competência entre tribunais",
];

export default function STJ() {
  const [competenciasAbertas, setCompetenciasAbertas] = useState(true);
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const dados = await buscarSTJ();
        setLista(dados || []);
      } catch (e) {
        console.error("Erro ao carregar STJ:", e);
        setLista([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const presidente = lista.find(
    (p) =>
      (p.cargo || "").toLowerCase().includes("presidente") &&
      !(p.cargo || "").toLowerCase().includes("vice")
  );

  const filtrados = lista.filter((p) => {
    const t = busca.toLowerCase();
    return (
      (p.nome || "").toLowerCase().includes(t) ||
      (p.cargo || "").toLowerCase().includes(t) ||
      (p.turma || "").toLowerCase().includes(t)
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link
          to="/judiciario"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          ← Voltar ao Judiciário
        </Link>

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-3">
          Superior Tribunal de Justiça — STJ
        </h1>

        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { to: "/judiciario", label: "Visão Geral" },
            { to: "/judiciario/stf", label: "STF" },
            { to: "/judiciario/stj", label: "STJ", active: true },
            { to: "/judiciario/tse", label: "TSE" },
            { to: "/judiciario/tst", label: "TST" },
            { to: "/judiciario/stm", label: "STM" },
            { to: "/judiciario/controle", label: "Órgãos de Controle" },
          ].map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={
                "flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors " +
                (tab.active
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300")
              }
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <button
              type="button"
              onClick={() => setCompetenciasAbertas(!competenciasAbertas)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-sm md:text-base font-bold text-slate-800">
                O que é o STJ?
              </h2>
              {competenciasAbertas ? (
                <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
              )}
            </button>

            {competenciasAbertas && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs md:text-sm text-slate-600 mb-4">
                  O Superior Tribunal de Justiça é responsável por uniformizar a
                  interpretação da legislação federal em todo o território
                  nacional. É conhecido como o “Tribunal da Cidadania”.
                </p>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Principais competências
                </div>
                <ul className="space-y-1.5">
                  {competenciasSTJ.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs md:text-sm text-slate-700 flex gap-2"
                    >
                      <span className="text-sky-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {presidente && (
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
              <h2 className="text-sm md:text-base font-bold text-slate-800 mb-3">
                Presidente do STJ
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-600">
                  {(presidente.nome || "P").charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    {presidente.nome}
                  </div>
                  <div className="text-xs text-slate-500">
                    {presidente.cargo}
                    {presidente.data_inicio
                      ? ` · desde ${presidente.data_inicio}`
                      : ""}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm md:text-base font-bold text-slate-800">
                  Composição
                </h2>
                <span className="text-xs md:text-sm text-slate-500">
                  {lista.length} membros
                </span>
              </div>
              <input
                type="text"
                placeholder="Buscar ministro, cargo ou turma..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 w-full md:w-64"
              />
            </div>

            {loading ? (
              <div className="border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                Carregando composição do STJ...
              </div>
            ) : filtrados.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                Nenhum registro encontrado. Cadastre no Admin → Judiciário (órgão
                STJ).
              </div>
            ) : (
              <div className="space-y-2">
                {filtrados.map((p) => (
                  <div
                    key={p.id}
                    className="border border-slate-200 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setAbertoId(abertoId === p.id ? null : p.id)
                      }
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
                        {(p.nome || "M").charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-800 truncate">
                          {p.nome}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {p.cargo}
                          {p.turma ? ` · ${p.turma}` : ""}
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
                            <span className="text-slate-400">Fim previsto: </span>
                            {p.data_fim}
                          </div>
                        )}
                        {p.turma && (
                          <div>
                            <span className="text-slate-400">Turma: </span>
                            {p.turma}
                          </div>
                        )}
                        {p.origem && (
                          <div>
                            <span className="text-slate-400">Origem: </span>
                            {p.origem}
                          </div>
                        )}
                        {!p.indicado_por &&
                          !p.data_inicio &&
                          !p.turma &&
                          !p.origem && (
                            <div className="mt-3 text-slate-400">
                              Sem detalhes adicionais cadastrados.
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
