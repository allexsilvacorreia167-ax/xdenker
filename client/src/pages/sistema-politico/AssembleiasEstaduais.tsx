// src/pages/sistema-politico/AssembleiasEstaduais.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

const spectrumColors = {
  esquerda: "#C0392B",
  centroEsquerda: "#E67E22",
  centro: "#F1C40F",
  centroDireita: "#52BE80",
  direita: "#1E8449",
};

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function AssembleiasEstaduais() {
  const [estadoSelecionado, setEstadoSelecionado] = useState("SP");

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link
          to="/sistema-politico"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          ← Voltar à Visão Geral
        </Link>

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-1">
          Assembleias Estaduais
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          Composição e deputados das assembleias legislativas estaduais
        </p>

        {/* Abas de navegação interna padronizadas */}
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <Link
            to="/sistema-politico"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Visão Geral
          </Link>
          <Link
            to="/sistema-politico/executivo"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Executivo Federal
          </Link>
          <Link
            to="/sistema-politico/senado"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Senado
          </Link>
          <Link
            to="/sistema-politico/camara"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Câmara dos Deputados
          </Link>
          <Link
            to="/sistema-politico/assembleias"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-slate-800 text-white transition-colors"
          >
            Assembleias Estaduais
          </Link>
        </div>

        {/* Conteúdo Principal estruturado */}
        <div className="space-y-6">
          {/* Seletor de Estado */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-4">Selecione um Estado</h2>

            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {estados.map((uf) => (
                <button
                  key={uf}
                  onClick={() => setEstadoSelecionado(uf)}
                  className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-colors ${estadoSelecionado === uf
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                >
                  {uf}
                </button>
              ))}
            </div>
          </section>

          {/* Hemiciclo do Estado */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">
                Assembleia Legislativa — {estadoSelecionado}
              </h2>
              <span className="text-xs md:text-sm text-slate-500">Deputados Estaduais</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl h-56 md:h-64 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <div className="text-3xl md:text-4xl font-bold text-slate-600">{estadoSelecionado}</div>
                  <div className="text-xs md:text-sm mt-2">Mapa / Ilustração do Estado</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl h-56 md:h-64 flex items-end justify-center pb-6 md:pb-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-slate-300">—</div>
                  <div className="text-xs md:text-sm text-slate-400 mt-2">Hemiciclo da Assembleia</div>
                  <div className="text-[11px] md:text-xs text-slate-400 mt-1">
                    Quantidade varia por estado
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

          {/* Lista de Deputados Estaduais */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <h2 className="text-sm md:text-base font-bold text-slate-800">
                Deputados Estaduais — {estadoSelecionado}
              </h2>
              <input
                type="text"
                placeholder="Buscar deputado estadual..."
                className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50 w-full md:w-auto"
              />
            </div>

            <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs md:text-sm">
              Lista de deputados estaduais de {estadoSelecionado} será carregada aqui
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}