// src/pages/sistema-politico/SistemaPoliticoGeral.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  buscarExecutivo,
  contarTitularesPorCargo,
} from "../../services/politicaService";

const spectrumColors = {
  esquerda: "#C0392B",
  centroEsquerda: "#E67E22",
  centro: "#D4AC0D",
  centroDireita: "#27AE60",
  direita: "#145A32",
};

export default function SistemaPoliticoGeral() {
  const [presidente, setPresidente] = useState<any>(null);
  const [ministros, setMinistros] = useState<any[]>([]);
  const [totais, setTotais] = useState({
    deputadosFederais: 513,
    senadores: 81,
    governadores: 27,
    deputadosEstaduais: 0,
  });
  const [loading, setLoading] = useState(true);

  const dadosEspectro = [
    { id: "esquerda", nome: "Esquerda", seats: 124, percent: 21, cor: spectrumColors.esquerda, rotacao: 0 },
    { id: "centro-esquerda", nome: "Centro-Esquerda", seats: 98, percent: 17, cor: spectrumColors.centroEsquerda, rotacao: 70 },
    { id: "centro", nome: "Centro", seats: 142, percent: 24, cor: spectrumColors.centro, rotacao: 140 },
    { id: "centro-direita", nome: "Centro-Direita", seats: 130, percent: 22, cor: spectrumColors.centroDireita, rotacao: 210 },
    { id: "direita", nome: "Direita", seats: 95, percent: 16, cor: spectrumColors.direita, rotacao: 280 },
  ];

  // Distribuição exata de bolinhas para a Câmara (Total: 513)
  const camaraDistribuicao = [
    { nome: "Esquerda", count: 86, cor: spectrumColors.esquerda },
    { nome: "Centro-Esquerda", count: 39, cor: spectrumColors.centroEsquerda },
    { nome: "Centro", count: 135, cor: spectrumColors.centro },
    { nome: "Centro-Direita", count: 150, cor: spectrumColors.centroDireita },
    { nome: "Direita", count: 103, cor: spectrumColors.direita },
  ];

  // Distribuição exata de bolinhas para o Senado (Total: 81)
  const senadoDistribuicao = [
    { nome: "Esquerda", count: 11, cor: spectrumColors.esquerda },
    { nome: "Centro-Esquerda", count: 6, cor: spectrumColors.centroEsquerda },
    { nome: "Centro", count: 27, cor: spectrumColors.centro },
    { nome: "Centro-Direita", count: 10, cor: spectrumColors.centroDireita },
    { nome: "Direita", count: 27, cor: spectrumColors.direita },
  ];

  // Gerador de array plano de cores baseado na quantidade de assentos
  const gerarArrayBolinhas = (distribuicao: { count: number; cor: string }[]) => {
    const lista: string[] = [];
    distribuicao.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        lista.push(item.cor);
      }
    });
    return lista;
  };

  const bolinhasCamara = gerarArrayBolinhas(camaraDistribuicao);
  const bolinhasSenado = gerarArrayBolinhas(senadoDistribuicao);

  useEffect(() => {
    async function carregar() {
      try {
        const [executivo, contagem] = await Promise.all([
          buscarExecutivo(),
          contarTitularesPorCargo(),
        ]);

        const pres = executivo.find((p: any) => p.cargo === "Presidente") || null;
        const mins = executivo.filter((p: any) => p.cargo === "Ministro").slice(0, 6);

        setPresidente(pres);
        setMinistros(mins);
        setTotais({
          deputadosFederais: contagem.deputadosFederais || 513,
          senadores: contagem.senadores || 81,
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

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
          ← Voltar ao início
        </Link>

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-1">
          Sistema Político do Brasil
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          Entenda quem forma o poder no Brasil
        </p>

        {/* Abas */}
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { to: "/sistema-politico", label: "Visão Geral", active: true },
            { to: "/sistema-politico/executivo", label: "Executivo" },
            { to: "/sistema-politico/senado", label: "Senado" },
            { to: "/sistema-politico/camara", label: "Câmara dos Deputados" },
            { to: "/sistema-politico/assembleias", label: "Assembleias Estaduais" },
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
          {/* Gráfico Estilo Anéis Concêntricos */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm md:text-base font-bold text-slate-800">Espectro Político Geral</h2>
                <p className="text-xs text-slate-500 mt-0.5">Distribuição de forças e representatividade</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                Total: 589 assentos
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50/50 border border-slate-100 rounded-2xl p-6">
                <div className="relative w-56 h-56 flex items-center justify-center">
                  <div className="absolute z-10 text-center bg-white w-20 h-20 rounded-full shadow-inner flex flex-col items-center justify-center border border-slate-100">
                    <span className="text-[10px] font-bold text-red-600">{dadosEspectro[0].percent}% <span className="text-[8px] text-slate-400 font-normal">Esq</span></span>
                    <span className="text-[10px] font-bold text-amber-600">{dadosEspectro[1].percent}% <span className="text-[8px] text-slate-400 font-normal">C-E</span></span>
                    <span className="text-[10px] font-bold text-yellow-600">{dadosEspectro[2].percent}% <span className="text-[8px] text-slate-400 font-normal">Cen</span></span>
                    <span className="text-[10px] font-bold text-emerald-600">{dadosEspectro[3].percent}% <span className="text-[8px] text-slate-400 font-normal">C-D</span></span>
                    <span className="text-[10px] font-bold text-green-800">{dadosEspectro[4].percent}% <span className="text-[8px] text-slate-400 font-normal">Dir</span></span>
                  </div>

                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {dadosEspectro.map((item, index) => {
                      const raio = 47 - (index * 5.8);
                      const circunferencia = 2 * Math.PI * raio;
                      const preenchimento = (item.percent / 100) * circunferencia;
                      const dasharray = `${preenchimento} ${circunferencia}`;

                      return (
                        <g
                          key={item.id}
                          className="transition-all duration-300 cursor-pointer hover:brightness-110"
                          style={{ transformOrigin: '50px 50px', transform: `rotate(${item.rotacao}deg)` }}
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
                            className="transition-all duration-700"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <span className="text-[11px] text-slate-400 mt-4 text-center">Passe o mouse sobre os anéis para destaque</span>
              </div>

              <div className="lg:col-span-7 space-y-2.5">
                {dadosEspectro.map((item) => (
                  <div
                    key={item.id}
                    className="space-y-1 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 transition-all duration-300 hover:shadow-sm hover:border-slate-200 hover:brightness-105"
                  >
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 flex items-center gap-2 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.cor }} />
                        {item.nome}
                      </span>
                      <span className="text-slate-800 font-bold bg-white px-2 py-0.5 rounded border border-slate-100 shadow-2xs text-[11px]">
                        {item.seats} assentos
                      </span>
                    </div>

                    <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.seats / 160) * 100}%`,
                          backgroundColor: item.cor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Executivo Federal - Resumo */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Executivo</h2>
              <Link to="/sistema-politico/executivo" className="text-xs md:text-sm text-sky-600 hover:underline font-medium">
                Ver completo →
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-shrink-0 w-full lg:w-64">
                <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-xl p-4 text-white text-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full bg-slate-300 mb-3 overflow-hidden flex items-center justify-center text-slate-600 font-bold text-xl">
                    {presidente?.nome ? presidente.nome.charAt(0) : "P"}
                  </div>
                  <div className="font-bold text-sm md:text-base">
                    {loading ? "Carregando..." : presidente?.nome || "Não cadastrado"}
                  </div>
                  <div className="text-xs md:text-sm opacity-90">
                    {presidente?.partido || ""} • Presidente
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {loading ? (
                  <div className="text-xs text-slate-400">Carregando ministros...</div>
                ) : ministros.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {ministros.map((m) => (
                      <div
                        key={m.id}
                        className="border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
                          {(m.nome || "M").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs md:text-sm font-medium text-slate-800 truncate">{m.nome}</div>
                          <div className="text-[11px] text-slate-500 truncate">{m.pasta || "Ministro"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    Nenhum ministro cadastrado. Cadastre na tabela executivo.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Legislativo Federal - Hemiciclos de Bolinhas */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-6">Legislativo Federal</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Câmara dos Deputados (Hemiciclo de Bolinhas) */}
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between mb-4">
                  <h3 className="text-xs md:text-sm font-semibold text-slate-700">Câmara dos Deputados</h3>
                  <Link to="/sistema-politico/camara" className="text-xs text-sky-600 hover:underline font-medium">
                    Ver todos →
                  </Link>
                </div>

                <div className="relative w-full h-56 flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full max-w-[320px]" viewBox="0 0 200 110">
                    {bolinhasCamara.map((cor, i) => {
                      // Distribuição matemática em arcos concêntricos simulando o hemiciclo
                      const raioBase = 38;
                      const anel = Math.floor(i / 85); // Divide em linhas/arcos
                      const raio = raioBase + (anel * 11);
                      const totalNoArco = Math.min(85, bolinhasCamara.length - (anel * 85));
                      const angulo = Math.PI - ((i % 85) / (totalNoArco - 1 || 1)) * Math.PI;
                      const cx = 100 + raio * Math.cos(angulo);
                      const cy = 95 - raio * Math.sin(angulo);

                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r="2.2"
                          fill={cor}
                          className="transition-all duration-300 hover:scale-150 cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute bottom-2 text-center">
                    <div className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{totais.deputadosFederais}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Câmara</div>
                  </div>
                </div>
              </div>

              {/* Senado Federal (Hemiciclo de Bolinhas) */}
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between mb-4">
                  <h3 className="text-xs md:text-sm font-semibold text-slate-700">Senado Federal</h3>
                  <Link to="/sistema-politico/senado" className="text-xs text-sky-600 hover:underline font-medium">
                    Ver todos →
                  </Link>
                </div>

                <div className="relative w-full h-56 flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full max-w-[320px]" viewBox="0 0 200 110">
                    {bolinhasSenado.map((cor, i) => {
                      const raioBase = 45;
                      const anel = Math.floor(i / 40);
                      const raio = raioBase + (anel * 15);
                      const totalNoArco = Math.min(40, bolinhasSenado.length - (anel * 40));
                      const angulo = Math.PI - ((i % 40) / (totalNoArco - 1 || 1)) * Math.PI;
                      const cx = 100 + raio * Math.cos(angulo);
                      const cy = 95 - raio * Math.sin(angulo);

                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r="3"
                          fill={cor}
                          className="transition-all duration-300 hover:scale-150 cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute bottom-2 text-center">
                    <div className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{totais.senadores}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Senado</div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Assembleias */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Assembleias Estaduais</h2>
              <Link to="/sistema-politico/assembleias" className="text-xs md:text-sm text-sky-600 hover:underline font-medium">
                Ver todas →
              </Link>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl h-40 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <div className="text-sm">Mapa do Brasil</div>
                <div className="text-xs mt-1">Clique em um estado</div>
              </div>
            </div>
          </section>
        </div>

        <p className="text-center text-xs md:text-sm text-slate-500 mt-8">
          Clique em qualquer cadeira para ver os detalhes do político
        </p>
      </div>
    </div>
  );
}