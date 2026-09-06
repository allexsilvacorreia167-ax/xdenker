// src/pages/judiciario/OrgaosControle.tsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const orgaos = [
  {
    id: "pf",
    nome: "Polícia Federal",
    cargo: "Diretor-Geral",
    descricao: "Órgão permanente responsável pela investigação de crimes de competência federal.",
    competencias: [
      "Investigar crimes contra a ordem política e social",
      "Combater o tráfico de drogas, armas e pessoas",
      "Investigar corrupção e crimes financeiros",
      "Controlar a entrada e saída de pessoas do território nacional",
      "Prevenir e reprimir o terrorismo",
    ],
  },
  {
    id: "cgu",
    nome: "Controladoria-Geral da União (CGU)",
    cargo: "Ministro de Estado",
    descricao: "Órgão de controle interno do Poder Executivo Federal.",
    competencias: [
      "Fiscalizar a aplicação de recursos públicos federais",
      "Prevenir e combater a corrupção",
      "Promover a transparência e o acesso à informação",
      "Realizar auditorias e fiscalizações em órgãos federais",
      "Ouvidoria-geral do cidadão",
    ],
  },
  {
    id: "agu",
    nome: "Advocacia-Geral da União (AGU)",
    cargo: "Advogado-Geral da União",
    descricao: "Instituição que representa a União judicial e extrajudicialmente.",
    competencias: [
      "Defender os interesses da União em processos judiciais",
      "Prestar consultoria e assessoramento jurídico ao Poder Executivo",
      "Representar a União em acordos e negociações",
      "Controlar a legalidade dos atos da administração pública federal",
    ],
  },
  {
    id: "pgr",
    nome: "Procuradoria-Geral da República (PGR)",
    cargo: "Procurador-Geral da República",
    descricao: "Chefe do Ministério Público Federal e do Ministério Público da União.",
    competencias: [
      "Promover a ação penal pública em crimes federais",
      "Defender a ordem jurídica e os interesses sociais e individuais indisponíveis",
      "Ajuizar ações de inconstitucionalidade",
      "Fiscalizar o cumprimento das leis e da Constituição",
      "Atuar como fiscal da lei em processos de relevância federal",
    ],
  },
];

export default function OrgaosControle() {
  const [aberto, setAberto] = useState<string | null>("pf");

  const toggle = (id: string) => {
    setAberto(aberto === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <img src="/logo.png" alt="XDENKER" className="h-9 w-auto" />
          </Link>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center flex-1">
            Órgãos de Controle
          </h1>
          <Link to="/judiciario" className="text-sm text-blue-600 hover:underline font-medium">
            ← Voltar ao Judiciário
          </Link>
        </div>

        <nav className="flex overflow-x-auto border-t">
          <Link to="/judiciario" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">Visão Geral</Link>
          <Link to="/judiciario/stf" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">STF</Link>
          <Link to="/judiciario/stj" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">STJ</Link>
          <Link to="/judiciario/tse" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">TSE</Link>
          <Link to="/judiciario/tst" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">TST</Link>
          <Link to="/judiciario/stm" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">STM</Link>
          <Link to="/judiciario/controle" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-blue-600 text-blue-600">Órgãos de Controle</Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {orgaos.map((orgao) => (
          <section key={orgao.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <button
              onClick={() => toggle(orgao.id)}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="font-bold text-gray-900 text-lg">{orgao.nome}</div>
                <div className="text-sm text-blue-600 mt-0.5">{orgao.cargo}</div>
              </div>
              {aberto === orgao.id ? (
                <ChevronDown size={22} className="text-gray-400" />
              ) : (
                <ChevronRight size={22} className="text-gray-400" />
              )}
            </button>

            {aberto === orgao.id && (
              <div className="px-6 pb-6 border-t bg-gray-50">
                <p className="text-sm text-gray-700 mt-4 mb-4">{orgao.descricao}</p>

                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Principais competências
                </div>
                <ul className="space-y-1.5 mb-5">
                  {orgao.competencias.map((comp, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-blue-600">•</span>
                      {comp}
                    </li>
                  ))}
                </ul>

                <div className="border rounded-xl p-5 bg-white text-center text-gray-400 text-sm">
                  Dados do ocupante atual do cargo serão carregados aqui (nome, quem indicou, data de posse, etc.)
                </div>
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}
