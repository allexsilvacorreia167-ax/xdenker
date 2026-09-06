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
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link
          to="/judiciario"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          ← Voltar ao Judiciário
        </Link>

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-3">
          Órgãos de Controle
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
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            STM
          </Link>
          <Link
            to="/judiciario/controle"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-slate-800 text-white transition-colors"
          >
            Órgãos de Controle
          </Link>
        </div>

        {/* Conteúdo Principal estruturado */}
        <div className="space-y-6">
          {orgaos.map((orgao) => (
            <section key={orgao.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(orgao.id)}
                className="w-full flex items-center justify-between px-4 md:px-6 py-4 md:py-5 text-left hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="font-bold text-sm md:text-base text-slate-900">{orgao.nome}</div>
                  <div className="text-xs md:text-sm text-sky-600 mt-0.5">{orgao.cargo}</div>
                </div>
                {aberto === orgao.id ? (
                  <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
                )}
              </button>

              {aberto === orgao.id && (
                <div className="px-4 md:px-6 pb-6 border-t border-slate-200 bg-slate-50 pt-4">
                  <p className="text-xs md:text-sm text-slate-600 mb-4">{orgao.descricao}</p>

                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Principais competências
                  </div>
                  <ul className="space-y-1.5 mb-5">
                    {orgao.competencias.map((comp, i) => (
                      <li key={i} className="text-xs md:text-sm text-slate-700 flex gap-2">
                        <span className="text-sky-500">•</span>
                        {comp}
                      </li>
                    ))}
                  </ul>

                  <div className="border border-slate-200 rounded-xl p-5 bg-white text-center text-xs md:text-sm text-slate-400">
                    Dados do ocupante atual do cargo serão carregados aqui (nome, quem indicou, data de posse, etc.)
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}