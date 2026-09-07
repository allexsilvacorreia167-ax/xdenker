// src/pages/sistema-politico/SistemaPoliticoGeral.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  buscarExecutivo,
  contarTitularesPorCargo,
} from "../../services/politicaService";

const spectrumColors = {
  esquerda: "#C0392B",
  centroEsquerda: "#E67E22",
  centro: "#F1C40F",
  centroDireita: "#52BE80",
  direita: "#1E8449",
};

export default function SistemaPoliticoGeral() {
  const [presidente, setPresidente] = useState<any>(null);
  const [ministros, setMinistros] = useState<any[]>([]);
  const [totais, setTotais] = useState({
    deputadosFederais: 513,
    senadores: 81,
    governadores: 27,
    deputadosEstaduais: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [executivo, contagem] = await Promise.all([
          buscarExecutivo(),
          contarTitularesPorCargo(),
        ]);

        const pres = executivo.find((p: any) => p.cargo === "Presidente") || null;
        const mins = executivo.filter((p: any) => p.cargo === "Ministro").slice(0, 6);

        setPresidente(pres);
        setMinistros(mins);
        setTotais({
          deputadosFederais: contagem.deputadosFederais || 513,
          senadores: contagem.senadores || 81,
          governadores: contagem.governadores || 27,
          deputadosEstaduais: contagem.deputadosEstaduais || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar dados gerais:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
          ← Voltar ao início
        </Link>

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-1">
          Sistema Político do Brasil
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          Entenda quem forma o poder no Brasil
        </p>

        {/* Abas */}
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { to: "/sistema-politico", label: "Visão Geral", active: true },
            { to: "/sistema-politico/executivo", label: "Executivo Federal" },
            { to: "/sistema-politico/senado", label: "Senado" },
            { to: "/sistema-politico/camara", label: "Câmara dos Deputados" },
            { to: "/sistema-politico/assembleias", label: "Assembleias Estaduais" },
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
          {/* Barra de Espectro Geral (placeholder até calcularmos de verdade) */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { nome: "Esquerda", seats: 124, percent: 21, cor: spectrumColors.esquerda },
              { nome: "Centro-Esquerda", seats: 98, percent: 17, cor: spectrumColors.centroEsquerda },
              { nome: "Centro", seats: 142, percent: 24, cor: spectrumColors.centro },
              { nome: "Centro-Direita", seats: 130, percent: 22, cor: spectrumColors.centroDireita },
              { nome: "Direita", seats: 95, percent: 16, cor: spectrumColors.direita },
            ].map((item) => (
              <div
                key={item.nome}
                className="rounded-xl p-4 text-white shadow-sm"
                style={{ backgroundColor: item.cor }}
              >
                <div className="text-xs md:text-sm font-medium opacity-90">{item.nome}</div>
                <div className="text-xl md:text-2xl font-bold mt-1">{item.seats}</div>
                <div className="text-xs md:text-sm opacity-90">{item.percent}%</div>
              </div>
            ))}
          </section>

          {/* Executivo Federal - Resumo */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Executivo Federal</h2>
              <Link to="/sistema-politico/executivo" className="text-xs md:text-sm text-sky-600 hover:underline font-medium">
                Ver completo →
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-shrink-0 w-full lg:w-64">
                <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-xl p-4 text-white text-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full bg-slate-300 mb-3 overflow-hidden flex items-center justify-center text-slate-600 font-bold text-xl">
                    {presidente?.nome ? presidente.nome.charAt(0) : "P"}
                  </div>
                  <div className="font-bold text-sm md:text-base">
                    {loading ? "Carregando..." : presidente?.nome || "Não cadastrado"}
                  </div>
                  <div className="text-xs md:text-sm opacity-90">
                    {presidente?.partido || ""} • Presidente
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {loading ? (
                  <div className="text-xs text-slate-400">Carregando ministros...</div>
                ) : ministros.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {ministros.map((m) => (
                      <div
                        key={m.id}
                        className="border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
                          {(m.nome || "M").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs md:text-sm font-medium text-slate-800 truncate">{m.nome}</div>
                          <div className="text-[11px] text-slate-500 truncate">{m.pasta || "Ministro"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    Nenhum ministro cadastrado. Cadastre na tabela executivo.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Legislativo Federal */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-6">Legislativo Federal</h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Câmara */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs md:text-sm font-semibold text-slate-700">Câmara dos Deputados</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs md:text-sm text-slate-500">{totais.deputadosFederais} cadeiras</span>
                    <Link to="/sistema-politico/camara" className="text-xs md:text-sm text-sky-600 hover:underline font-medium">
                      Ver todos →
                    </Link>
                  </div>
                </div>
                <div className="relative bg-slate-50 border border-slate-200 rounded-xl h-64 flex items-end justify-center pb-6">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-slate-300">{totais.deputadosFederais}</div>
                    <div className="text-xs text-slate-400 mt-1">Hemiciclo da Câmara</div>
                    <div className="mt-2 text-[11px] text-slate-500">Dados oficiais do TSE</div>
                  </div>
                </div>
              </div>

              {/* Senado */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs md:text-sm font-semibold text-slate-700">Senado Federal</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs md:text-sm text-slate-500">{totais.senadores} cadeiras</span>
                    <Link to="/sistema-politico/senado" className="text-xs md:text-sm text-sky-600 hover:underline font-medium">
                      Ver todos →
                    </Link>
                  </div>
                </div>
                <div className="relative bg-slate-50 border border-slate-200 rounded-xl h-64 flex items-end justify-center pb-6">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-slate-300">{totais.senadores}</div>
                    <div className="text-xs text-slate-400 mt-1">Hemiciclo do Senado</div>
                    <div className="mt-2 text-[11px] text-slate-500">Dados oficiais do TSE</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legenda */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex flex-wrap gap-4 text-xs md:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: spectrumColors.esquerda }} />
                  Esquerda
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: spectrumColors.centroEsquerda }} />
                  Centro-Esquerda
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: spectrumColors.centro }} />
                  Centro
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: spectrumColors.centroDireita }} />
                  Centro-Direita
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: spectrumColors.direita }} />
                  Direita
                </div>
              </div>
            </div>
          </section>

          {/* Assembleias */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Assembleias Estaduais</h2>
              <Link to="/sistema-politico/assembleias" className="text-xs md:text-sm text-sky-600 hover:underline font-medium">
                Ver todas →
              </Link>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl h-40 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <div className="text-sm">Mapa do Brasil</div>
                <div className="text-xs mt-1">Clique em um estado</div>
              </div>
            </div>
          </section>
        </div>

        <p className="text-center text-xs md:text-sm text-slate-500 mt-8">
          Clique em qualquer cadeira para ver os detalhes do político
        </p>
      </div>
    </div>
  );
}
