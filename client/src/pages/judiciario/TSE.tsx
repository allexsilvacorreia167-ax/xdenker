// src/pages/judiciario/TSE.tsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const competenciasTSE = [
  "Regulamentar o processo eleitoral brasileiro",
  "Julgar recursos contra decisões dos Tribunais Regionais Eleitorais (TREs)",
  "Cassar diplomas e mandatos em casos de abuso de poder econômico ou político",
  "Proclamar o resultado das eleições para Presidente da República",
  "Aplicar a Lei das Eleições, a Lei da Ficha Limpa e a legislação partidária",
  "Responder consultas sobre matéria eleitoral",
];

export default function TSE() {
  const [competenciasAbertas, setCompetenciasAbertas] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <img src="/logo.png" alt="XDENKER" className="h-9 w-auto" />
          </Link>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center flex-1">
            Tribunal Superior Eleitoral
          </h1>
          <Link to="/judiciario" className="text-sm text-blue-600 hover:underline font-medium">
            ← Voltar ao Judiciário
          </Link>
        </div>

        <nav className="flex overflow-x-auto border-t">
          <Link to="/judiciario" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">Visão Geral</Link>
          <Link to="/judiciario/stf" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">STF</Link>
          <Link to="/judiciario/stj" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">STJ</Link>
          <Link to="/judiciario/tse" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-blue-600 text-blue-600">TSE</Link>
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
            <h2 className="text-lg font-bold text-gray-800">O que é o TSE?</h2>
            {competenciasAbertas ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>

          {competenciasAbertas && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4">
                O Tribunal Superior Eleitoral é o órgão máximo da Justiça Eleitoral. É responsável por organizar, fiscalizar e julgar as eleições no Brasil.
              </p>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Principais competências</div>
              <ul className="space-y-1.5">
                {competenciasTSE.map((item, i) => (
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
            <span className="text-sm text-gray-500">7 Ministros</span>
          </div>
          <div className="border rounded-xl p-8 text-center text-gray-400">
            Lista de ministros do TSE será carregada aqui (dados do Admin)
          </div>
        </section>
      </main>
    </div>
  );
}
