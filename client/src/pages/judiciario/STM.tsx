// src/pages/judiciario/STM.tsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const competenciasSTM = [
  "Julgar crimes militares definidos no Código Penal Militar",
  "Processar e julgar militares das Forças Armadas (Exército, Marinha e Aeronáutica)",
  "Julgar recursos contra decisões das Auditorias da Justiça Militar da União",
  "Garantir a aplicação da legislação penal e processual militar",
  "Julgar habeas corpus e outros processos de sua competência",
];

export default function STM() {
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
          Superior Tribunal Militar — STM
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
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
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
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-slate-800 text-white transition-colors"
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
              <h2 className="text-sm md:text-base font-bold text-slate-800">O que é o STM?</h2>
              {competenciasAbertas ? (
                <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
              )}
            </button>

            {competenciasAbertas && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs md:text-sm text-slate-600 mb-4">
                  O Superior Tribunal Militar é o órgão de cúpula da Justiça Militar da União. É composto por ministros vitalícios, nomeados pelo Presidente da República, sendo a maioria oriunda das Forças Armadas (Exército, Marinha e Aeronáutica) e uma parte de juristas civis.
                </p>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Principais competências</div>
                <ul className="space-y-1.5">
                  {competenciasSTM.map((item, i) => (
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
              <span className="text-xs md:text-sm text-slate-500">15 Ministros</span>
            </div>

            <div className="text-xs md:text-sm text-slate-600 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              Informações recomendadas para cada ministro do STM:
              <ul className="mt-2 space-y-1 ml-4">
                <li>• Nome e patente (ex: General de Exército, Almirante de Esquadra, Tenente-Brigadeiro)</li>
                <li>• Força de origem (Exército, Marinha ou Aeronáutica)</li>
                <li>• Quem indicou (Presidente da República)</li>
                <li>• Data de entrada e saída prevista (limite de 75 anos)</li>
                <li>• Se é Presidente ou Vice-Presidente do STM</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl p-8 text-center text-xs md:text-sm text-slate-400 bg-slate-50">
              Lista de ministros do STM será carregada aqui (dados do Admin)
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}