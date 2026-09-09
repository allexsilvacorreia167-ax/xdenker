// src/pages/sistema-politico/SistemaPoliticoGeral.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  buscarExecutivo,
  contarTitularesPorCargo,
  buscarDeputadosFederais,
  buscarSenadores,
} from "../../services/politicaService";
import Hemiciclo from "../../components/Hemiciclo";
import ExecutivoRadial from "../../components/ExecutivoRadial";

const spectrumColors = {
  esquerda: "#C0392B",
  centroEsquerda: "#E67E22",
  centro: "#D4AC0D",
  centroDireita: "#27AE60",
  direita: "#145A32",
};

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

function contarEspectro(lista: any[]) {
  const base = {
    Esquerda: 0,
    "Centro-Esquerda": 0,
    Centro: 0,
    "Centro-Direita": 0,
    Direita: 0,
  };
  lista.forEach((p) => {
    const e = p.espectro || "Centro";
    if (e in base) (base as any)[e]++;
    else base.Centro++;
  });
  return base;
}

export default function SistemaPoliticoGeral() {
  const [presidente, setPresidente] = useState<any>(null);
  const [ministros, setMinistros] = useState<any[]>([]);
  const [deputados, setDeputados] = useState<any[]>([]);
  const [senadores, setSenadores] = useState<any[]>([]);
  const [totais, setTotais] = useState({
    deputadosFederais: 513,
    senadores: 81,
    governadores: 27,
    deputadosEstaduais: 0,
  });
  const [loading, setLoading] = useState(true);
  const [espectroAberto, setEspectroAberto] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const [executivo, contagem, deps, sens] = await Promise.all([
          buscarExecutivo("federal"),
          contarTitularesPorCargo(),
          buscarDeputadosFederais(),
          buscarSenadores(),
        ]);

        const pres =
          executivo.find((p: any) => p.cargo === "Presidente") || null;
        const mins = executivo.filter((p: any) => p.cargo === "Ministro");

        setPresidente(pres);
        setMinistros(mins);
        setDeputados(deps || []);
        setSenadores(sens || []);
        setTotais({
          deputadosFederais: contagem.deputadosFederais || deps?.length || 513,
          senadores: contagem.senadores || sens?.length || 81,
          governadores: contagem.governadores || 27,
          deputadosEstaduais: contagem.deputadosEstaduais || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar dados gerais:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  // Espectro geral = Câmara + Senado (dados reais)
  const contagemGeral = contarEspectro([...deputados, ...senadores]);
  const totalAssentos =
    Object.values(contagemGeral).reduce((a, b) => a + b, 0) || 1;

  const dadosEspectro = [
    {
      id: "esquerda",
      nome: "Esquerda",
      seats: contagemGeral.Esquerda,
      percent: Math.round((contagemGeral.Esquerda / totalAssentos) * 100),
      cor: spectrumColors.esquerda,
      rotacao: 0,
    },
    {
      id: "centro-esquerda",
      nome: "Centro-Esquerda",
      seats: contagemGeral["Centro-Esquerda"],
      percent: Math.round(
        (contagemGeral["Centro-Esquerda"] / totalAssentos) * 100
      ),
      cor: spectrumColors.centroEsquerda,
      rotacao: 70,
    },
    {
      id: "centro",
      nome: "Centro",
      seats: contagemGeral.Centro,
      percent: Math.round((contagemGeral.Centro / totalAssentos) * 100),
      cor: spectrumColors.centro,
      rotacao: 140,
    },
    {
      id: "centro-direita",
      nome: "Centro-Direita",
      seats: contagemGeral["Centro-Direita"],
      percent: Math.round(
        (contagemGeral["Centro-Direita"] / totalAssentos) * 100
      ),
      cor: spectrumColors.centroDireita,
      rotacao: 210,
    },
    {
      id: "direita",
      nome: "Direita",
      seats: contagemGeral.Direita,
      percent: Math.round((contagemGeral.Direita / totalAssentos) * 100),
      cor: spectrumColors.direita,
      rotacao: 280,
    },
  ];

  const maxSeats = Math.max(...dadosEspectro.map((d) => d.seats), 1);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          ← Voltar ao início
        </Link>

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-1">
          Sistema Político do Brasil
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          Entenda quem forma o poder no Brasil
        </p>

        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { to: "/sistema-politico", label: "Visão Geral", active: true },
            { to: "/sistema-politico/executivo", label: "Executivo" },
            { to: "/sistema-politico/senado", label: "Senado" },
            { to: "/sistema-politico/camara", label: "Câmara dos Deputados" },
            {
              to: "/sistema-politico/assembleias",
              label: "Assembleias Estaduais",
            },
          ].map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={
                "flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors " +
                (tab.active
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300")
              }
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="space-y-6">
          {/* Espectro Geral (dados reais Câmara + Senado) */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm md:text-base font-bold text-slate-800">
                  Espectro Político Geral
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Câmara + Senado (dados cadastrados)
                </p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                Total: {totalAssentos} assentos
              </span>
            </div>

            {/* Só o gráfico circular */}
            <div className="flex flex-col items-center justify-center bg-slate-50/50 border border-slate-100 rounded-2xl p-6">
              <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center">
                <div className="absolute z-10 text-center bg-white w-20 h-20 rounded-full shadow-inner flex flex-col items-center justify-center border border-slate-100">
                  {dadosEspectro.map((item, i) => (
                    <span
                      key={item.id}
                      className="text-[10px] font-bold"
                      style={{ color: item.cor }}
                    >
                      {item.percent}%{" "}
                      <span className="text-[8px] text-slate-400 font-normal">
                        {["Esq", "C-E", "Cen", "C-D", "Dir"][i]}
                      </span>
                    </span>
                  ))}
                </div>

                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {dadosEspectro.map((item, index) => {
                    const raio = 47 - index * 5.8;
                    const circunferencia = 2 * Math.PI * raio;
                    const preenchimento =
                      (item.percent / 100) * circunferencia;
                    const dasharray = `${preenchimento} ${circunferencia}`;

                    return (
                      <g
                        key={item.id}
                        className="transition-all duration-300"
                        style={{
                          transformOrigin: "50px 50px",
                          transform: `rotate(${item.rotacao}deg)`,
                        }}
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r={raio}
                          fill="transparent"
                          stroke={item.cor}
                          strokeWidth="4"
                          opacity="0.2"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r={raio}
                          fill="transparent"
                          stroke={item.cor}
                          strokeWidth="4"
                          strokeDasharray={dasharray}
                          strokeLinecap="round"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Sanfona: barras de detalhe */}
            <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setEspectroAberto((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <span className="text-xs md:text-sm font-semibold text-slate-700">
                  Detalhamento por espectro
                </span>
                <span className="text-slate-400 text-sm">
                  {espectroAberto ? "▲" : "▼"}
                </span>
              </button>
              {espectroAberto && (
                <div className="p-3 md:p-4 space-y-2.5 border-t border-slate-100">
                  {dadosEspectro.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-1 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100"
                    >
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 flex items-center gap-2 font-semibold">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: item.cor }}
                          />
                          {item.nome}
                        </span>
                        <span className="text-slate-800 font-bold bg-white px-2 py-0.5 rounded border border-slate-100 text-[11px]">
                          {item.seats} assentos · {item.percent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(item.seats / maxSeats) * 100}%`,
                            backgroundColor: item.cor,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Executivo — diagrama radial */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm md:text-base font-bold text-slate-800">
                Executivo Federal
              </h2>
              <Link
                to="/sistema-politico/executivo"
                className="text-xs md:text-sm text-sky-600 hover:underline font-medium"
              >
                Ver completo →
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Presidente no centro · ministérios ao redor (cor = espectro)
            </p>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                Carregando executivo...
              </div>
            ) : (
              <ExecutivoRadial
                presidente={presidente}
                ministros={ministros}
                height={320}
              />
            )}
          </section>

          {/* Legislativo — Hemiciclos reais */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-6">
              Legislativo Federal
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs md:text-sm font-semibold text-slate-700">
                    Câmara dos Deputados
                  </h3>
                  <Link
                    to="/sistema-politico/camara"
                    className="text-xs text-sky-600 hover:underline font-medium"
                  >
                    Ver todos →
                  </Link>
                </div>
                {loading ? (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                    Carregando...
                  </div>
                ) : (
                  <Hemiciclo
                    politicos={deputados}
                    label="CÂMARA"
                    totalLabel={String(totais.deputadosFederais)}
                    height={200}
                    maxArcos={10}
                  />
                )}
              </div>

              <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs md:text-sm font-semibold text-slate-700">
                    Senado Federal
                  </h3>
                  <Link
                    to="/sistema-politico/senado"
                    className="text-xs text-sky-600 hover:underline font-medium"
                  >
                    Ver todos →
                  </Link>
                </div>
                {loading ? (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                    Carregando...
                  </div>
                ) : (
                  <Hemiciclo
                    politicos={senadores}
                    label="SENADO"
                    totalLabel={String(totais.senadores)}
                    height={200}
                    maxArcos={6}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Assembleias — atalhos por UF */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">
                Assembleias Estaduais
              </h2>
              <Link
                to="/sistema-politico/assembleias"
                className="text-xs md:text-sm text-sky-600 hover:underline font-medium"
              >
                Ver todas →
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {UFS.map((uf) => (
                <Link
                  key={uf}
                  to={`/sistema-politico/assembleias`}
                  className="w-10 h-9 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800 flex items-center justify-center transition-colors"
                >
                  {uf}
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Clique em um estado na página de Assembleias para ver o hemiciclo
              e a lista de deputados.
            </p>
          </section>
        </div>

        <p className="text-center text-xs md:text-sm text-slate-500 mt-8">
          Use as abas acima para explorar cada poder em detalhe
        </p>
      </div>
    </div>
  );
}
