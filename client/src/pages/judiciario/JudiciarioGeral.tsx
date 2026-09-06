// src/pages/judiciario/JudiciarioGeral.tsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const instituicoes = [
  {
    id: "stf",
    nome: "Supremo Tribunal Federal",
    sigla: "STF",
    descricao: "Órgão de cúpula do Poder Judiciário brasileiro. É o guardião da Constituição Federal.",
    competencias: [
      "Guardar a Constituição Federal",
      "Julgar ações diretas de inconstitucionalidade (ADI)",
      "Julgar mandados de segurança contra atos do Presidente da República, das Mesas da Câmara e do Senado",
      "Julgar o Presidente da República e ministros em crimes comuns",
      "Decidir conflitos entre a União e os Estados",
    ],
    presidente: "Luís Roberto Barroso",
    path: "/judiciario/stf",
  },
  {
    id: "stj",
    nome: "Superior Tribunal de Justiça",
    sigla: "STJ",
    descricao: "Responsável por uniformizar a interpretação da lei federal em todo o Brasil.",
    competencias: [
      "Uniformizar a interpretação da legislação federal",
      "Julgar recursos especiais contra decisões de Tribunais de Justiça e Tribunais Regionais Federais",
      "Processar e julgar governadores em crimes comuns",
      "Julgar habeas corpus e mandados de segurança em casos previstos na Constituição",
    ],
    presidente: "Herman Benjamin",
    path: "/judiciario/stj",
  },
  {
    id: "tse",
    nome: "Tribunal Superior Eleitoral",
    sigla: "TSE",
    descricao: "Órgão máximo da Justiça Eleitoral brasileira.",
    competencias: [
      "Regulamentar as eleições no Brasil",
      "Julgar recursos contra decisões dos Tribunais Regionais Eleitorais",
      "Cassar diplomas e mandatos em casos de fraude ou abuso de poder",
      "Proclamar os resultados das eleições presidenciais",
      "Aplicar a Lei das Eleições e a Lei da Ficha Limpa",
    ],
    presidente: "Alexandre de Moraes",
    path: "/judiciario/tse",
  },
  {
    id: "tst",
    nome: "Tribunal Superior do Trabalho",
    sigla: "TST",
    descricao: "Órgão de cúpula da Justiça do Trabalho.",
    competencias: [
      "Uniformizar a jurisprudência trabalhista",
      "Julgar recursos de revista contra decisões dos Tribunais Regionais do Trabalho",
      "Processar e julgar dissídios coletivos de abrangência nacional",
      "Garantir o cumprimento da Consolidação das Leis do Trabalho (CLT)",
    ],
    presidente: "Lelio Bentes Corrêa",
    path: "/judiciario/tst",
  },
  {
    id: "stm",
    nome: "Superior Tribunal Militar",
    sigla: "STM",
    descricao: "Órgão de cúpula da Justiça Militar da União.",
    competencias: [
      "Julgar crimes militares definidos no Código Penal Militar",
      "Processar militares das Forças Armadas em crimes militares",
      "Julgar recursos contra decisões das Auditorias Militares",
      "Garantir a aplicação da legislação penal militar",
    ],
    presidente: "Tenente-Brigadeiro Francisco Joseli Parente Camelo",
    path: "/judiciario/stm",
  },
];

const orgaosControle = [
  {
    nome: "Polícia Federal",
    cargo: "Diretor-Geral",
    descricao: "Investigação de crimes federais, combate ao crime organizado, corrupção e crimes fronteiriços.",
  },
  {
    nome: "Controladoria-Geral da União (CGU)",
    cargo: "Ministro",
    descricao: "Órgão de controle interno do Governo Federal. Fiscaliza o uso de recursos públicos e combate a corrupção.",
  },
  {
    nome: "Advocacia-Geral da União (AGU)",
    cargo: "Advogado-Geral",
    descricao: "Representa a União em processos judiciais e extrajudiciais. Defende os interesses do Estado.",
  },
  {
    nome: "Procuradoria-Geral da República (PGR)",
    cargo: "Procurador-Geral",
    descricao: "Chefe do Ministério Público Federal. Atua na defesa da ordem jurídica e dos interesses sociais.",
  },
];

export default function JudiciarioGeral() {
  const [aberto, setAberto] = useState<string | null>(null);

  const toggle = (id: string) => {
    setAberto(aberto === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="bg-white border-b sticky top-0 z-50 w-full shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <img src="/logo.png" alt="XDENKER" className="h-9 w-auto" />
          </Link>

          <h1 className="text-lg md:text-2xl font-bold text-gray-900 text-center flex-1">
            Judiciário
          </h1>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 pb-3">
          Entenda a estrutura da Justiça no Brasil
        </p>

        <nav className="border-t">
          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto justify-center">
            <Link to="/judiciario" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-blue-600 text-blue-600">
              Visão Geral
            </Link>
            <Link to="/judiciario/stf" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              STF
            </Link>
            <Link to="/judiciario/stj" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              STJ
            </Link>
            <Link to="/judiciario/tse" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              TSE
            </Link>
            <Link to="/judiciario/tst" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              TST
            </Link>
            <Link to="/judiciario/stm" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              STM
            </Link>
            <Link to="/judiciario/controle" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Órgãos de Controle
            </Link>
          </div>
        </nav>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 flex-1">
        {/* Tribunais Superiores */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tribunais Superiores</h2>

          <div className="space-y-3">
            {instituicoes.map((item) => (
              <div key={item.id} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {item.sigla} — {item.nome}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      Presidente: {item.presidente}
                    </div>
                  </div>
                  {aberto === item.id ? (
                    <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {aberto === item.id && (
                  <div className="px-5 pb-5 border-t bg-gray-50">
                    <p className="text-sm text-gray-700 mt-4 mb-3">{item.descricao}</p>

                    <div className="mb-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Principais competências
                      </div>
                      <ul className="space-y-1">
                        {item.competencias.map((comp, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-blue-600">•</span>
                            {comp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      to={item.path}
                      className="inline-block mt-2 text-sm text-blue-600 font-medium hover:underline"
                    >
                      Ver composição completa →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Órgãos de Controle */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Órgãos de Controle e Investigação</h2>
            <Link
              to="/judiciario/controle"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgaosControle.map((orgao) => (
              <div key={orgao.nome} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="font-semibold text-gray-900">{orgao.nome}</div>
                <div className="text-sm text-blue-600 mt-0.5">{orgao.cargo}</div>
                <p className="text-sm text-gray-600 mt-2">{orgao.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-center text-sm text-gray-500 pb-8">
          Clique em qualquer instituição para ver mais informações
        </p>
      </main>
    </div>
  );
}