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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="bg-white border-b sticky top-0 z-50 w-full shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src="/logo-xdenker.png" alt="XDENKER" className="h-9 w-auto" />
            </Link>
          </div>

          <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center flex-1">
            Câmara dos Deputados
          </h1>

          <Link
            to="/sistema-politico"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ← Voltar à Visão Geral
          </Link>
        </div>

        <nav className="border-t">
          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto justify-center">
            <Link to="/sistema-politico" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Visão Geral
            </Link>
            <Link to="/sistema-politico/executivo" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Executivo Federal
            </Link>
            <Link to="/sistema-politico/senado" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Senado
            </Link>
            <Link to="/sistema-politico/camara" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-blue-600 text-blue-600">
              Câmara dos Deputados
            </Link>
            <Link to="/sistema-politico/assembleias" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Assembleias Estaduais
            </Link>
          </div>
        </nav>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 flex-1">
        {/* Resumo */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">513</div>
            <div className="text-sm text-gray-500 mt-1">Deputados Federais</div>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">4</div>
            <div className="text-sm text-gray-500 mt-1">Anos de mandato</div>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">100%</div>
            <div className="text-sm text-gray-500 mt-1">Renovação total</div>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">27</div>
            <div className="text-sm text-gray-500 mt-1">UFs representadas</div>
          </div>
        </section>

        {/* Hemiciclo */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Composição da Câmara</h2>
            <span className="text-sm text-gray-500">513 cadeiras • 512 + 1 Presidente</span>
          </div>

          <div className="bg-gray-50 rounded-xl h-96 flex items-end justify-center pb-8 relative">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-300">513</div>
              <div className="text-sm text-gray-400 mt-2">Hemiciclo da Câmara dos Deputados</div>
              <div className="text-xs text-gray-400 mt-1">
                Bolinha maior = Presidente da Câmara
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="mt-6 pt-5 border-t">
            <div className="flex flex-wrap gap-4 text-sm">
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
                <span className="w-4 h-4 rounded-full border-2 border-gray-800 bg-white" />
                Presidente da Câmara
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-yellow-500 bg-gray-300" />
                Líder / Pres. Comissão
              </div>
            </div>
          </div>
        </section>

        {/* Filtros e Lista */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <h2 className="text-lg font-bold text-gray-800">Deputados Federais</h2>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Buscar deputado..."
                className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="border rounded-lg px-3 py-1.5 text-sm">
                <option>Todos os estados</option>
                <option>SP</option>
                <option>RJ</option>
                <option>MG</option>
                <option>BA</option>
                <option>CE</option>
              </select>
              <select className="border rounded-lg px-3 py-1.5 text-sm">
                <option>Todos os espectros</option>
                <option>Esquerda</option>
                <option>Centro-Esquerda</option>
                <option>Centro</option>
                <option>Centro-Direita</option>
                <option>Direita</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            Lista completa dos 513 deputados com nome, partido, UF, espectro, cargos especiais e possibilidade de clicar para ver detalhes.
          </div>

          <div className="border rounded-xl p-8 text-center text-gray-400">
            Lista de deputados será carregada aqui (dados do Admin + TSE)
          </div>
        </section>
      </main>
    </div>
  );
}