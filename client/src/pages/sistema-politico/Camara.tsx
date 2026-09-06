// src/pages/sistema-politico/Camara.tsx
import { Link } from "react-router-dom";

const spectrumColors = {
  esquerda: "#C0392B",
  centroEsquerda: "#E67E22",
  centro: "#F1C40F",
  centroDireita: "#52BE80",
  direita: "#1E8449",
};

export default function Camara() {
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
          Câmara dos Deputados
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          Composição e deputados federais da câmara baixa
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
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-slate-800 text-white transition-colors"
          >
            Câmara dos Deputados
          </Link>
          <Link
            to="/sistema-politico/assembleias"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Assembleias Estaduais
          </Link>
        </div>

        {/* Conteúdo Principal estruturado */}
        <div className="space-y-6">
          {/* Resumo */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">513</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">Deputados Federais</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">4</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">Anos de mandato</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">100%</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">Renovação total</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">27</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">UFs representadas</div>
            </div>
          </section>

          {/* Hemiciclo */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Composição da Câmara</h2>
              <span className="text-xs md:text-sm text-slate-500">513 cadeiras • 512 + 1 Presidente</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl h-72 md:h-96 flex items-end justify-center pb-6 md:pb-8 relative">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-slate-300">513</div>
                <div className="text-xs md:text-sm text-slate-400 mt-2">Hemiciclo da Câmara dos Deputados</div>
                <div className="text-[11px] md:text-xs text-slate-400 mt-1">
                  Bolinha maior = Presidente da Câmara
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
                <div className="flex items-center gap-2 ml-4">
                  <span className="w-4 h-4 rounded-full border-2 border-slate-800 bg-white" />
                  Presidente da Câmara
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-yellow-500 bg-slate-300" />
                  Líder / Pres. Comissão
                </div>
              </div>
            </div>
          </section>

          {/* Filtros e Lista */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Deputados Federais</h2>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Buscar deputado..."
                  className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50 flex-1 md:flex-none"
                />
                <select className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm bg-slate-50">
                  <option>Todos os estados</option>
                  <option>SP</option>
                  <option>RJ</option>
                  <option>MG</option>
                  <option>BA</option>
                  <option>CE</option>
                </select>
                <select className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm bg-slate-50">
                  <option>Todos os espectros</option>
                  <option>Esquerda</option>
                  <option>Centro-Esquerda</option>
                  <option>Centro</option>
                  <option>Centro-Direita</option>
                  <option>Direita</option>
                </select>
              </div>
            </div>

            <div className="text-xs md:text-sm text-slate-500 mb-4">
              Lista completa dos 513 deputados com nome, partido, UF, espectro, cargos especiais e possibilidade de clicar para ver detalhes.
            </div>

            <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs md:text-sm">
              Lista de deputados será carregada aqui (dados do Admin + TSE)
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}