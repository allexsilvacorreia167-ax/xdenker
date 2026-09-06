// src/pages/sistema-politico/Senado.tsx
import { Link } from "react-router-dom";

const spectrumColors = {
  esquerda: "#C0392B",
  centroEsquerda: "#E67E22",
  centro: "#F1C40F",
  centroDireita: "#52BE80",
  direita: "#1E8449",
};

export default function Senado() {
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
          Senado Federal
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          Composição e senadores do parlamento federal
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
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-slate-800 text-white transition-colors"
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
              <div className="text-2xl md:text-3xl font-bold text-slate-800">81</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">Senadores</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">27</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">Estados + DF</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">8</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">Anos de mandato</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">2/3</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">Renovação parcial</div>
            </div>
          </section>

          {/* Hemiciclo */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Composição do Senado</h2>
              <span className="text-xs md:text-sm text-slate-500">81 cadeiras • 80 + 1 Presidente</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl h-64 md:h-80 flex items-end justify-center pb-6 md:pb-8 relative">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-slate-300">81</div>
                <div className="text-xs md:text-sm text-slate-400 mt-2">Hemiciclo do Senado Federal</div>
                <div className="text-[11px] md:text-xs text-slate-400 mt-1">
                  Bolinha maior = Presidente do Senado
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
                  Presidente do Senado
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-yellow-500 bg-slate-300" />
                  Líder / Pres. Comissão
                </div>
              </div>
            </div>
          </section>

          {/* Lista de Senadores (placeholder) */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Senadores</h2>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Buscar senador..."
                  className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50 flex-1 md:flex-none"
                />
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
              Aqui será listado os 81 senadores com: nome, partido, UF, espectro, data de início e fim do mandato, e cargos especiais (Presidente, Líder, etc.).
            </div>

            <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs md:text-sm">
              Lista de senadores será carregada aqui (dados do Admin + TSE)
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}