// src/pages/sistema-politico/ExecutivoFederal.tsx
import { Link } from "react-router-dom";

const spectrumColors = {
  esquerda: "#C0392B",
  centroEsquerda: "#E67E22",
  centro: "#F1C40F",
  centroDireita: "#52BE80",
  direita: "#1E8449",
};

const ministros = [
  { nome: "Fernando Haddad", pasta: "Fazenda", partido: "PT", espectro: "esquerda" },
  { nome: "Flávio Dino", pasta: "Justiça", partido: "PSB", espectro: "centroEsquerda" },
  { nome: "Simone Tebet", pasta: "Planejamento", partido: "MDB", espectro: "centro" },
  { nome: "Alexandre Padilha", pasta: "Relações Institucionais", partido: "PT", espectro: "esquerda" },
  { nome: "Rui Costa", pasta: "Casa Civil", partido: "PT", espectro: "esquerda" },
  { nome: "Camilo Santana", pasta: "Educação", partido: "PT", espectro: "esquerda" },
  { nome: "Nísia Trindade", pasta: "Saúde", partido: "Sem partido", espectro: "centroEsquerda" },
  { nome: "Carlos Fávaro", pasta: "Agricultura", partido: "PSD", espectro: "centro" },
  { nome: "Silvio Costa Filho", pasta: "Portos e Aeroportos", partido: "Republicanos", espectro: "centroDireita" },
  { nome: "Renan Filho", pasta: "Transportes", partido: "MDB", espectro: "centro" },
  { nome: "Luciana Santos", pasta: "Ciência e Tecnologia", partido: "PCdoB", espectro: "esquerda" },
  { nome: "Jader Filho", pasta: "Cidades", partido: "MDB", espectro: "centro" },
];

export default function ExecutivoFederal() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link
          to="/sistema-politico"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          ← Voltar à Visão Geral
        </Link>

        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-1">
          Executivo Federal
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          Composição e ministérios do governo federal
        </p>

        {/* Abas de navegação interna padronizadas */}
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <Link
            to="/sistema-politico"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Visão Geral
          </Link>
          <Link
            to="/sistema-politico/executivo"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-slate-800 text-white transition-colors"
          >
            Executivo Federal
          </Link>
          <Link
            to="/sistema-politico/senado"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Senado
          </Link>
          <Link
            to="/sistema-politico/camara"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Câmara dos Deputados
          </Link>
          <Link
            to="/sistema-politico/assembleias"
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap bg-white text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Assembleias Estaduais
          </Link>
        </div>

        {/* Conteúdo Principal estruturado */}
        <div className="space-y-6">
          {/* Presidente */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-4">Presidente da República</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-200 flex-shrink-0" />
              <div className="text-center sm:text-left">
                <div className="text-xl md:text-2xl font-bold text-slate-800">Lula da Silva</div>
                <div className="text-xs md:text-sm text-slate-500 mt-1">PT • Mandato 2023-2027</div>
                <div className="mt-3 inline-flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ background: spectrumColors.esquerda }}
                  >
                    Esquerda
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Ministros */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Ministros de Estado</h2>
              <span className="text-xs md:text-sm text-slate-500">{ministros.length} pastas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ministros.map((ministro) => (
                <div
                  key={ministro.nome}
                  className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs md:text-sm font-medium text-slate-800 truncate">{ministro.nome}</div>
                      <div className="text-[11px] md:text-xs text-slate-500 truncate">{ministro.pasta}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] text-slate-500">{ministro.partido}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background:
                              spectrumColors[ministro.espectro as keyof typeof spectrumColors],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Espectro do Executivo */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-4">Espectro do Executivo Federal</h2>
            <div className="h-6 md:h-8 rounded-full overflow-hidden flex">
              <div className="h-full" style={{ width: "45%", background: spectrumColors.esquerda }} />
              <div className="h-full" style={{ width: "20%", background: spectrumColors.centroEsquerda }} />
              <div className="h-full" style={{ width: "25%", background: spectrumColors.centro }} />
              <div className="h-full" style={{ width: "10%", background: spectrumColors.centroDireita }} />
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-xs md:text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: spectrumColors.esquerda }} />
                Esquerda
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: spectrumColors.centroEsquerda }} />
                Centro-Esquerda
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: spectrumColors.centro }} />
                Centro
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: spectrumColors.centroDireita }} />
                Centro-Direita
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}