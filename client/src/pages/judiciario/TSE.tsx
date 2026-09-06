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
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link
          to="/judiciario"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          ← Voltar ao Judiciário
        </Link>

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-3">
          Tribunal Superior Eleitoral — TSE
        </h1>

        {/* Abas de navegação interna padronizadas */}
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <Link
            to="/judiciario"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Visão Geral
          </Link>
          <Link
            to="/judiciario/stf"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            STF
          </Link>
          <Link
            to="/judiciario/stj"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            STJ
          </Link>
          <Link
            to="/judiciario/tse"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-slate-800 text-white transition-colors"
          >
            TSE
          </Link>
          <Link
            to="/judiciario/tst"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            TST
          </Link>
          <Link
            to="/judiciario/stm"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            STM
          </Link>
          <Link
            to="/judiciario/controle"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Órgãos de Controle
          </Link>
        </div>

        {/* Conteúdo Principal estruturado */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <button
              type="button"
              onClick={() => setCompetenciasAbertas(!competenciasAbertas)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-sm md:text-base font-bold text-slate-800">O que é o TSE?</h2>
              {competenciasAbertas ? (
                <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
              )}
            </button>

            {competenciasAbertas && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs md:text-sm text-slate-600 mb-4">
                  O Tribunal Superior Eleitoral é o órgão máximo da Justiça Eleitoral. É responsável por organizar, fiscalizar e julgar as eleições no Brasil.
                </p>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Principais competências</div>
                <ul className="space-y-1.5">
                  {competenciasTSE.map((item, i) => (
                    <li key={i} className="text-xs md:text-sm text-slate-700 flex gap-2">
                      <span className="text-sky-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Composição</h2>
              <span className="text-xs md:text-sm text-slate-500">7 Ministros</span>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 text-center text-xs md:text-sm text-slate-400 bg-slate-50">
              Lista de ministros do TSE será carregada aqui (dados do Admin)
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}