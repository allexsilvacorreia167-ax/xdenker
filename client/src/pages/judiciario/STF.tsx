// src/pages/judiciario/STF.tsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const competenciasSTF = [
  "Guardar a Constituição Federal de 1988",
  "Julgar Ações Diretas de Inconstitucionalidade (ADI) e Arguições de Descumprimento de Preceito Fundamental (ADPF)",
  "Processar e julgar o Presidente da República, o Vice-Presidente e os Ministros de Estado em crimes comuns",
  "Julgar mandados de segurança contra atos do Presidente da República, das Mesas da Câmara e do Senado",
  "Decidir conflitos de competência entre Tribunais Superiores e entre a União e os Estados",
  "Julgar recursos extraordinários contra decisões que contrariem a Constituição",
];

const ministros = [
  {
    nome: "Luís Roberto Barroso",
    cargo: "Presidente do STF",
    indicadoPor: "Dilma Rousseff",
    entrada: "2013",
    saidaPrevista: "2030 (75 anos)",
    turma: "1ª Turma",
    origem: "Advogado e Professor",
  },
  {
    nome: "Alexandre de Moraes",
    cargo: "Ministro",
    indicadoPor: "Michel Temer",
    entrada: "2017",
    saidaPrevista: "2043 (75 anos)",
    turma: "1ª Turma",
    origem: "Promotor e Professor",
  },
  {
    nome: "Nunes Marques",
    cargo: "Ministro",
    indicadoPor: "Jair Bolsonaro",
    entrada: "2020",
    saidaPrevista: "2047 (75 anos)",
    turma: "2ª Turma",
    origem: "Desembargador",
  },
  {
    nome: "André Mendonça",
    cargo: "Ministro",
    indicadoPor: "Jair Bolsonaro",
    entrada: "2021",
    saidaPrevista: "2048 (75 anos)",
    turma: "1ª Turma",
    origem: "Advogado da União",
  },
  {
    nome: "Cármen Lúcia",
    cargo: "Ministra",
    indicadoPor: "Luiz Inácio Lula da Silva",
    entrada: "2006",
    saidaPrevista: "2029 (75 anos)",
    turma: "2ª Turma",
    origem: "Procuradora e Professora",
  },
];

export default function STF() {
  const [aberto, setAberto] = useState<string | null>(null);

  const toggle = (nome: string) => {
    setAberto(aberto === nome ? null : nome);
  };

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
          Supremo Tribunal Federal — STF
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
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-slate-800 text-white transition-colors"
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
          {/* Competências */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-2">O que é o STF?</h2>
            <p className="text-xs md:text-sm text-slate-600 mb-4">
              O Supremo Tribunal Federal é o órgão de cúpula do Poder Judiciário brasileiro e o guardião da Constituição Federal.
            </p>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Principais competências</div>
            <ul className="space-y-1.5">
              {competenciasSTF.map((item, i) => (
                <li key={i} className="text-xs md:text-sm text-slate-700 flex gap-2">
                  <span className="text-sky-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Composição */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Composição atual</h2>
              <span className="text-xs md:text-sm text-slate-500">11 Ministros</span>
            </div>

            <div className="space-y-2">
              {ministros.map((ministro) => (
                <div key={ministro.nome} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggle(ministro.nome)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{ministro.nome}</div>
                      <div className="text-xs text-slate-500">{ministro.cargo}</div>
                    </div>
                    {aberto === ministro.nome ? (
                      <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {aberto === ministro.nome && (
                    <div className="px-4 pb-4 border-t border-slate-200 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm pt-3">
                      <div>
                        <span className="text-slate-500">Indicado por:</span>{" "}
                        <span className="font-medium text-slate-900">{ministro.indicadoPor}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Entrada:</span>{" "}
                        <span className="font-medium text-slate-900">{ministro.entrada}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Saída prevista:</span>{" "}
                        <span className="font-medium text-slate-900">{ministro.saidaPrevista}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Turma:</span>{" "}
                        <span className="font-medium text-slate-900">{ministro.turma}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500">Origem:</span>{" "}
                        <span className="font-medium text-slate-900">{ministro.origem}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}