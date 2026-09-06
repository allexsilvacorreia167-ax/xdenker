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

// Dados de exemplo – substituir pelos reais depois
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <img src="/logo.png" alt="XDENKER" className="h-9 w-auto" />
          </Link>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center flex-1">
            Supremo Tribunal Federal
          </h1>
          <Link to="/judiciario" className="text-sm text-blue-600 hover:underline font-medium">
            ← Voltar ao Judiciário
          </Link>
        </div>

        <nav className="flex overflow-x-auto border-t">
          <Link to="/judiciario" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">Visão Geral</Link>
          <Link to="/judiciario/stf" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-blue-600 text-blue-600">STF</Link>
          <Link to="/judiciario/stj" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">STJ</Link>
          <Link to="/judiciario/tse" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">TSE</Link>
          <Link to="/judiciario/tst" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">TST</Link>
          <Link to="/judiciario/stm" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">STM</Link>
          <Link to="/judiciario/controle" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">Órgãos de Controle</Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Competências */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">O que é o STF?</h2>
          <p className="text-sm text-gray-600 mb-4">
            O Supremo Tribunal Federal é o órgão de cúpula do Poder Judiciário brasileiro e o guardião da Constituição Federal.
          </p>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Principais competências</div>
          <ul className="space-y-1.5">
            {competenciasSTF.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-blue-600">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Composição */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800">Composição atual</h2>
            <span className="text-sm text-gray-500">11 Ministros</span>
          </div>

          <div className="space-y-2">
            {ministros.map((ministro) => (
              <div key={ministro.nome} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(ministro.nome)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-gray-900">{ministro.nome}</div>
                    <div className="text-sm text-gray-500">{ministro.cargo}</div>
                  </div>
                  {aberto === ministro.nome ? (
                    <ChevronDown size={20} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-400" />
                  )}
                </button>

                {aberto === ministro.nome && (
                  <div className="px-5 pb-5 border-t bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Indicado por:</span>{" "}
                      <span className="font-medium">{ministro.indicadoPor}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Entrada:</span>{" "}
                      <span className="font-medium">{ministro.entrada}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Saída prevista:</span>{" "}
                      <span className="font-medium">{ministro.saidaPrevista}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Turma:</span>{" "}
                      <span className="font-medium">{ministro.turma}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Origem:</span>{" "}
                      <span className="font-medium">{ministro.origem}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
