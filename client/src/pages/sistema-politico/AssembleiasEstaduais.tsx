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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src="/logo-xdenker.png" alt="XDENKER" className="h-9 w-auto" />
            </Link>
          </div>

          <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center flex-1">
            Assembleias Estaduais
          </h1>

          <Link
            to="/sistema-politico"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            ← Voltar à Visão Geral
          </Link>
        </div>

        <nav className="flex overflow-x-auto border-t">
          <Link to="/sistema-politico" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
            Visão Geral
          </Link>
          <Link to="/sistema-politico/executivo" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
            Executivo Federal
          </Link>
          <Link to="/sistema-politico/senado" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
            Senado
          </Link>
          <Link to="/sistema-politico/camara" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
            Câmara dos Deputados
          </Link>
          <Link to="/sistema-politico/assembleias" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-blue-600 text-blue-600">
            Assembleias Estaduais
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Seletor de Estado */}
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione um Estado</h2>
          
          <div className="flex flex-wrap gap-2">
            {estados.map((uf) => (
              <button
                key={uf}
                onClick={() => setEstadoSelecionado(uf)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  estadoSelecionado === uf
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {uf}
              </button>
            ))}
          </div>
        </section>

        {/* Hemiciclo do Estado */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Assembleia Legislativa — {estadoSelecionado}
            </h2>
            <span className="text-sm text-gray-500">Deputados Estaduais</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl font-bold">{estadoSelecionado}</div>
                <div className="text-sm mt-2">Mapa / Ilustração do Estado</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl h-64 flex items-end justify-center pb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-300">—</div>
                <div className="text-sm text-gray-400 mt-2">Hemiciclo da Assembleia</div>
                <div className="text-xs text-gray-400 mt-1">
                  Quantidade varia por estado
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
            </div>
          </div>
        </section>

        {/* Lista de Deputados Estaduais */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <h2 className="text-lg font-bold text-gray-800">
              Deputados Estaduais — {estadoSelecionado}
            </h2>
            <input
              type="text"
              placeholder="Buscar deputado estadual..."
              className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border rounded-xl p-8 text-center text-gray-400">
            Lista de deputados estaduais de {estadoSelecionado} será carregada aqui
          </div>
        </section>
      </main>
    </div>
  );
}
