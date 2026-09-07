// src/pages/sistema-politico/ExecutivoFederal.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buscarExecutivo } from "../../services/politicaService";

const spectrumColors: Record<string, string> = {
  "Esquerda": "#C0392B",
  "Centro-Esquerda": "#E67E22",
  "Centro": "#F1C40F",
  "Centro-Direita": "#52BE80",
  "Direita": "#1E8449",
};

export default function ExecutivoFederal() {
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarExecutivo();
        setLista(dados || []);
      } catch (error) {
        console.error("Erro ao carregar executivo:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const presidente = lista.find((p) => p.cargo === "Presidente");
  const vice = lista.find((p) => p.cargo === "Vice-Presidente");
  const ministros = lista.filter((p) => p.cargo === "Ministro");

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link to="/sistema-politico" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">← Voltar à Visão Geral</Link>
        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-1">Executivo Federal</h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">Composição e ministérios do governo federal</p>

        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { to: "/sistema-politico", label: "Visão Geral" },
            { to: "/sistema-politico/executivo", label: "Executivo Federal", active: true },
            { to: "/sistema-politico/senado", label: "Senado" },
            { to: "/sistema-politico/camara", label: "Câmara dos Deputados" },
            { to: "/sistema-politico/assembleias", label: "Assembleias Estaduais" },
          ].map((tab) => (
            <Link key={tab.to} to={tab.to}
              className={"flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors " + (tab.active ? "bg-slate-800 text-white" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300")}>
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-4">Presidente da República</h2>
            {loading ? (
              <div className="text-sm text-slate-400">Carregando...</div>
            ) : presidente ? (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-2xl">
                  {(presidente.nome || "P").charAt(0)}
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl md:text-2xl font-bold text-slate-800">{presidente.nome}</div>
                  <div className="text-xs md:text-sm text-slate-500 mt-1">
                    {presidente.partido || ""} {presidente.data_inicio ? "• desde " + presidente.data_inicio : ""}
                  </div>
                  {presidente.espectro && (
                    <div className="mt-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ background: spectrumColors[presidente.espectro] || "#666" }}>
                        {presidente.espectro}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">
                Presidente ainda não cadastrado. Cadastre na tabela executivo pelo Admin.
              </div>
            )}
          </section>

          {vice && (
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
              <h2 className="text-sm md:text-base font-bold text-slate-800 mb-3">Vice-Presidente</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                  {(vice.nome || "V").charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-slate-800">{vice.nome}</div>
                  <div className="text-xs text-slate-500">{vice.partido}</div>
                </div>
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Ministros de Estado</h2>
              <span className="text-xs md:text-sm text-slate-500">{ministros.length > 0 ? ministros.length + " pastas" : "—"}</span>
            </div>

            {loading ? (
              <div className="border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">Carregando ministros...</div>
            ) : ministros.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {ministros.map((m) => (
                  <div key={m.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
                        {(m.nome || "M").charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-800 truncate">{m.nome}</div>
                        <div className="text-xs text-slate-500 truncate">{m.pasta || "Ministro"}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-500">{m.partido || ""}</span>
                          {m.espectro && (
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: spectrumColors[m.espectro] || "#999" }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                Nenhum ministro cadastrado ainda.<br />Cadastre na tabela executivo pelo painel Admin.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
