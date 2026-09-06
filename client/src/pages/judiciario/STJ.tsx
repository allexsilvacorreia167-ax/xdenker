// src/pages/judiciario/STJ.tsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const competenciasSTJ = [
  "Uniformizar a interpretação da lei federal em todo o Brasil",
  "Julgar Recursos Especiais contra decisões de Tribunais de Justiça e Tribunais Regionais Federais",
  "Processar e julgar Governadores dos Estados e do Distrito Federal em crimes comuns",
  "Julgar habeas corpus e mandados de segurança em casos previstos na Constituição",
  "Decidir conflitos de competência entre tribunais",
];

export default function STJ() {
  const [competenciasAbertas, setCompetenciasAbertas] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <img src="/logo.png" alt="XDENKER" className="h-9 w-auto" />
          </Link>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center flex-1">
            Superior Tribunal de Justiça
          </h1>
          <Link to="/judiciario" className="text-sm text-blue-600 hover:underline font-medium">
            ← Voltar ao Judiciário
          </Link>
        </div>

        <nav className="flex overflow-x-auto border-t">
          <Link to="/judiciario" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">Visão Geral</Link>
          <Link to="/judiciario/stf" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">STF</Link>
          <Link to="/judiciario/stj" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-blue-600 text-blue-600">STJ</Link>
          <Link to="/judiciario/tse" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">TSE</Link>
          <Link to="/judiciario/tst" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">TST</Link>
          <Link to="/judiciario/stm" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">STM</Link>
          <Link to="/judiciario/controle" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">Órgãos de Controle</Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <button
            onClick={() => setCompetenciasAbertas(!competenciasAbertas)}
            className="w-full flex items-center justify-between text-left"
          >
            <h2 className="text-lg font-bold text-gray-800">O que é o STJ?</h2>
            {competenciasAbertas ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>

          {competenciasAbertas && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4">
                O Superior Tribunal de Justiça é responsável por uniformizar a interpretação da legislação federal em todo o território nacional. É conhecido como o “Tribunal da Cidadania”.
              </p>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Principais competências</div>
              <ul className="space-y-1.5">
                {competenciasSTJ.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-blue-600">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800">Composição</h2>
            <span className="text-sm text-gray-500">33 Ministros</span>
          </div>
          <div className="border rounded-xl p-8 text-center text-gray-400">
            Lista de ministros do STJ será carregada aqui (dados do Admin)
          </div>
        </section>
      </main>
    </div>
  );
}
