// src/pages/judiciario/JudiciarioGeral.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  buscarSTF,
  buscarSTJ,
  buscarTSE,
  buscarTST,
  buscarSTM,
  buscarOrgaosControle,
} from "../../services/politicaService";

type Instituicao = {
  id: string;
  nome: string;
  sigla: string;
  descricao: string;
  competencias: string[];
  path: string;
  presidente: string;
  qtd: number;
};

const META: Omit<Instituicao, "presidente" | "qtd">[] = [
  {
    id: "stf",
    nome: "Supremo Tribunal Federal",
    sigla: "STF",
    descricao:
      "Órgão de cúpula do Poder Judiciário brasileiro. É o guardião da Constituição Federal.",
    competencias: [
      "Guardar a Constituição Federal",
      "Julgar ações diretas de inconstitucionalidade (ADI)",
      "Julgar mandados de segurança contra atos do Presidente da República, das Mesas da Câmara e do Senado",
      "Julgar o Presidente da República e ministros em crimes comuns",
      "Decidir conflitos entre a União e os Estados",
    ],
    path: "/judiciario/stf",
  },
  {
    id: "stj",
    nome: "Superior Tribunal de Justiça",
    sigla: "STJ",
    descricao:
      "Responsável por uniformizar a interpretação da lei federal em todo o Brasil.",
    competencias: [
      "Uniformizar a interpretação da legislação federal",
      "Julgar recursos especiais contra decisões de Tribunais de Justiça e Tribunais Regionais Federais",
      "Processar e julgar governadores em crimes comuns",
      "Julgar habeas corpus e mandados de segurança em casos previstos na Constituição",
    ],
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
    path: "/judiciario/stm",
  },
];

const ORGAOS_CONTROLE_META = [
  {
    sigla: "PF",
    nome: "Polícia Federal",
    cargoPadrao: "Diretor-Geral",
    descricao:
      "Investigação de crimes federais, combate ao crime organizado, corrupção e crimes fronteiriços.",
  },
  {
    sigla: "CGU",
    nome: "Controladoria-Geral da União (CGU)",
    cargoPadrao: "Ministro",
    descricao:
      "Órgão de controle interno do Governo Federal. Fiscaliza o uso de recursos públicos e combate a corrupção.",
  },
  {
    sigla: "AGU",
    nome: "Advocacia-Geral da União (AGU)",
    cargoPadrao: "Advogado-Geral",
    descricao:
      "Representa a União em processos judiciais e extrajudiciais. Defende os interesses do Estado.",
  },
  {
    sigla: "PGR",
    nome: "Procuradoria-Geral da República (PGR)",
    cargoPadrao: "Procurador-Geral",
    descricao:
      "Chefe do Ministério Público Federal. Atua na defesa da ordem jurídica e dos interesses sociais.",
  },
];

function acharPresidente(lista: any[]) {
  const p = lista.find(
    (x) =>
      (x.cargo || "").toLowerCase().includes("presidente") &&
      !(x.cargo || "").toLowerCase().includes("vice")
  );
  return p?.nome || "Não cadastrado";
}

function acharTitular(lista: any[], sigla: string) {
  const doOrgao = lista.filter(
    (x) => (x.orgao || "").toUpperCase() === sigla
  );
  if (doOrgao.length === 0) return { nome: "Não cadastrado", cargo: "" };
  // prioriza cargos de chefia
  const chefia = doOrgao.find((x) =>
    /diretor|ministro|advogado-geral|procurador-geral|presidente/i.test(
      x.cargo || ""
    )
  );
  const p = chefia || doOrgao[0];
  return { nome: p.nome || "—", cargo: p.cargo || "" };
}

export default function JudiciarioGeral() {
  const [aberto, setAberto] = useState<string | null>(null);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [controle, setControle] = useState<
    { sigla: string; nome: string; descricao: string; titular: string; cargo: string; qtd: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const [stf, stj, tse, tst, stm, orgaos] = await Promise.all([
          buscarSTF(),
          buscarSTJ(),
          buscarTSE(),
          buscarTST(),
          buscarSTM(),
          buscarOrgaosControle(),
        ]);

        const mapas: Record<string, any[]> = {
          stf,
          stj,
          tse,
          tst,
          stm,
        };

        setInstituicoes(
          META.map((m) => ({
            ...m,
            presidente: acharPresidente(mapas[m.id] || []),
            qtd: (mapas[m.id] || []).length,
          }))
        );

        setControle(
          ORGAOS_CONTROLE_META.map((o) => {
            const doOrgao = (orgaos || []).filter(
              (x: any) => (x.orgao || "").toUpperCase() === o.sigla
            );
            const t = acharTitular(orgaos || [], o.sigla);
            return {
              sigla: o.sigla,
              nome: o.nome,
              descricao: o.descricao,
              titular: t.nome,
              cargo: t.cargo || o.cargoPadrao,
              qtd: doOrgao.length,
            };
          })
        );
      } catch (e) {
        console.error("Erro ao carregar Judiciário Geral:", e);
        // fallback estático sem nomes do banco
        setInstituicoes(
          META.map((m) => ({ ...m, presidente: "—", qtd: 0 }))
        );
        setControle(
          ORGAOS_CONTROLE_META.map((o) => ({
            sigla: o.sigla,
            nome: o.nome,
            descricao: o.descricao,
            titular: "—",
            cargo: o.cargoPadrao,
            qtd: 0,
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const toggle = (id: string) => {
    setAberto(aberto === id ? null : id);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-3">
          Poder Judiciário — Instituições e Órgãos Superiores
        </h1>

        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <Link
            to="/judiciario"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-slate-800 text-white transition-colors"
          >
            Visão Geral
          </Link>
          {[
            { to: "/judiciario/stf", label: "STF" },
            { to: "/judiciario/stj", label: "STJ" },
            { to: "/judiciario/tse", label: "TSE" },
            { to: "/judiciario/tst", label: "TST" },
            { to: "/judiciario/stm", label: "STM" },
            { to: "/judiciario/controle", label: "Órgãos de Controle" },
          ].map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-4">
              Tribunais Superiores
            </h2>

            {loading ? (
              <div className="text-sm text-slate-400 py-6 text-center">
                Carregando instituições...
              </div>
            ) : (
              <div className="space-y-3">
                {instituicoes.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-sm text-slate-900">
                          {item.sigla} — {item.nome}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Presidente: {item.presidente}
                          {item.qtd > 0 ? ` · ${item.qtd} membros` : ""}
                        </div>
                      </div>
                      {aberto === item.id ? (
                        <ChevronDown
                          size={18}
                          className="text-slate-400 flex-shrink-0"
                        />
                      ) : (
                        <ChevronRight
                          size={18}
                          className="text-slate-400 flex-shrink-0"
                        />
                      )}
                    </button>

                    {aberto === item.id && (
                      <div className="px-4 pb-4 border-t border-slate-200 bg-slate-50">
                        <p className="text-xs md:text-sm text-slate-700 mt-3 mb-3">
                          {item.descricao}
                        </p>
                        <div className="mb-3">
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Principais competências
                          </div>
                          <ul className="space-y-1">
                            {item.competencias.map((comp, i) => (
                              <li
                                key={i}
                                className="text-xs md:text-sm text-slate-700 flex gap-2"
                              >
                                <span className="text-sky-500">•</span>
                                {comp}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Link
                          to={item.path}
                          className="inline-block mt-1 text-xs md:text-sm text-sky-600 font-medium hover:underline"
                        >
                          Ver composição completa →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">
                Órgãos de Controle e Investigação
              </h2>
              <Link
                to="/judiciario/controle"
                className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                Ver todos →
              </Link>
            </div>

            {loading ? (
              <div className="text-sm text-slate-400 py-4 text-center">
                Carregando...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {controle.map((orgao) => (
                  <Link
                    key={orgao.sigla}
                    to="/judiciario/controle"
                    className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors block"
                  >
                    <div className="font-semibold text-sm text-slate-900">
                      {orgao.nome}
                    </div>
                    <div className="text-xs text-sky-600 mt-0.5">
                      {orgao.cargo}
                      {orgao.titular && orgao.titular !== "Não cadastrado"
                        ? `: ${orgao.titular}`
                        : ""}
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      {orgao.descricao}
                    </p>
                    {orgao.qtd > 0 && (
                      <div className="text-[11px] text-slate-400 mt-2">
                        {orgao.qtd} cadastrado(s) no sistema
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
