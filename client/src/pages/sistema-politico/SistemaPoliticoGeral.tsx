// src/pages/sistema-politico/SistemaPoliticoGeral.tsx
import { Link } from "react-router-dom";

const spectrumColors = {
  esquerda: "#C0392B",
  centroEsquerda: "#E67E22",
  centro: "#F1C40F",
  centroDireita: "#52BE80",
  direita: "#1E8449",
};

export default function SistemaPoliticoGeral() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 w-full shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <img
              src="/logo-xdenker.png"
              alt="XDENKER"
              className="h-9 w-auto"
            />
          </Link>

          <h1 className="text-lg md:text-2xl font-bold text-gray-900 text-center flex-1">
            Sistema Político do Brasil
          </h1>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 pb-3">
          Entenda quem forma o poder no Brasil
        </p>

        {/* Menu de abas */}
        <nav className="border-t">
          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto justify-center">
            <Link
              to="/sistema-politico"
              className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-blue-600 text-blue-600"
            >
              Visão Geral
            </Link>
            <Link
              to="/sistema-politico/executivo"
              className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            >
              Executivo Federal
            </Link>
            <Link
              to="/sistema-politico/senado"
              className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            >
              Senado
            </Link>
            <Link
              to="/sistema-politico/camara"
              className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            >
              Câmara dos Deputados
            </Link>
            <Link
              to="/sistema-politico/assembleias"
              className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            >
              Assembleias Estaduais
            </Link>
          </div>
        </nav>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 flex-1">
        {/* Barra de Espectro Geral */}
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
              <div className="text-sm font-medium opacity-90">{item.nome}</div>
              <div className="text-2xl font-bold mt-1">{item.seats}</div>
              <div className="text-sm opacity-90">{item.percent}%</div>
            </div>
          ))}
        </section>

        {/* Executivo Federal - Resumo */}
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Executivo Federal</h2>
            <Link
              to="/sistema-politico/executivo"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Ver completo →
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-shrink-0 w-full lg:w-64">
              <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-xl p-4 text-white text-center">
                <div className="w-28 h-28 mx-auto rounded-full bg-gray-300 mb-3 overflow-hidden" />
                <div className="font-bold text-lg">Lula da Silva</div>
                <div className="text-sm opacity-90">PT • Presidente</div>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {["Fernando Haddad", "Flávio Dino", "Simone Tebet", "Alexandre Padilha", "Rui Costa", "Camilo Santana"].map(
                  (nome) => (
                    <div
                      key={nome}
                      className="border rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{nome}</div>
                        <div className="text-xs text-gray-500">Ministro</div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Legislativo Federal */}
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Legislativo Federal</h2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Câmara */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">Câmara dos Deputados</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">513 cadeiras</span>
                  <Link
                    to="/sistema-politico/camara"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Ver todos →
                  </Link>
                </div>
              </div>

              <div className="relative bg-gray-50 rounded-xl h-64 flex items-end justify-center pb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-300">513</div>
                  <div className="text-xs text-gray-400 mt-1">Hemiciclo da Câmara</div>
                  <div className="mt-2 text-xs text-gray-500">512 + 1 Presidente da Câmara</div>
                </div>
              </div>
            </div>

            {/* Senado */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">Senado Federal</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">81 cadeiras</span>
                  <Link
                    to="/sistema-politico/senado"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Ver todos →
                  </Link>
                </div>
              </div>

              <div className="relative bg-gray-50 rounded-xl h-64 flex items-end justify-center pb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-300">81</div>
                  <div className="text-xs text-gray-400 mt-1">Hemiciclo do Senado</div>
                  <div className="mt-2 text-xs text-gray-500">80 + 1 Presidente do Senado</div>
                </div>
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
                Presidente da Casa
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-yellow-500 bg-gray-300" />
                Líder / Pres. Comissão
              </div>
            </div>
          </div>
        </section>

        {/* Espectro Geral do Poder */}
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Espectro Geral do Poder</h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">
                Executivo (Presidência + Governadores)
              </div>
              <div className="h-8 rounded-full overflow-hidden flex">
                <div className="h-full" style={{ width: "28%", background: spectrumColors.esquerda }} />
                <div className="h-full" style={{ width: "18%", background: spectrumColors.centroEsquerda }} />
                <div className="h-full" style={{ width: "22%", background: spectrumColors.centro }} />
                <div className="h-full" style={{ width: "20%", background: spectrumColors.centroDireita }} />
                <div className="h-full" style={{ width: "12%", background: spectrumColors.direita }} />
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">
                Legislativo (Senado + Câmara + Assembleias)
              </div>
              <div className="h-8 rounded-full overflow-hidden flex">
                <div className="h-full" style={{ width: "21%", background: spectrumColors.esquerda }} />
                <div className="h-full" style={{ width: "17%", background: spectrumColors.centroEsquerda }} />
                <div className="h-full" style={{ width: "24%", background: spectrumColors.centro }} />
                <div className="h-full" style={{ width: "22%", background: spectrumColors.centroDireita }} />
                <div className="h-full" style={{ width: "16%", background: spectrumColors.direita }} />
              </div>
            </div>
          </div>
        </section>

        {/* Assembleias Estaduais */}
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Assembleias Estaduais</h2>
            <Link
              to="/sistema-politico/assembleias"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl h-56 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-sm">Mapa do Brasil</div>
                <div className="text-xs mt-1">Clique em um estado</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl h-56 flex items-end justify-center pb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-300">SP</div>
                <div className="text-xs text-gray-400 mt-1">Hemiciclo da Assembleia</div>
              </div>
            </div>
          </div>
        </section>

        <p className="text-center text-sm text-gray-500 pb-8">
          Clique em qualquer cadeira para ver os detalhes do político
        </p>
      </main>
    </div>
  );
}