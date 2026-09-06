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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="bg-white border-b sticky top-0 z-50 w-full shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src="/logo-xdenker.png" alt="XDENKER" className="h-9 w-auto" />
            </Link>
          </div>

          <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center flex-1">
            Executivo Federal
          </h1>

          <Link
            to="/sistema-politico"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ← Voltar à Visão Geral
          </Link>
        </div>

        <nav className="border-t">
          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto justify-center">
            <Link to="/sistema-politico" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Visão Geral
            </Link>
            <Link to="/sistema-politico/executivo" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-blue-600 text-blue-600">
              Executivo Federal
            </Link>
            <Link to="/sistema-politico/senado" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Senado
            </Link>
            <Link to="/sistema-politico/camara" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Câmara dos Deputados
            </Link>
            <Link to="/sistema-politico/assembleias" className="px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Assembleias Estaduais
            </Link>
          </div>
        </nav>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 flex-1">
        {/* Presidente */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Presidente da República</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex-shrink-0" />
            <div>
              <div className="text-2xl font-bold text-gray-900">Lula da Silva</div>
              <div className="text-gray-600 mt-1">PT • Mandato 2023-2027</div>
              <div className="mt-2 inline-flex items-center gap-2">
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
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800">Ministros de Estado</h2>
            <span className="text-sm text-gray-500">{ministros.length} pastas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ministros.map((ministro) => (
              <div
                key={ministro.nome}
                className="border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">{ministro.nome}</div>
                    <div className="text-sm text-gray-500">{ministro.pasta}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">{ministro.partido}</span>
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
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Espectro do Executivo Federal</h2>
          <div className="h-10 rounded-full overflow-hidden flex">
            <div className="h-full" style={{ width: "45%", background: spectrumColors.esquerda }} />
            <div className="h-full" style={{ width: "20%", background: spectrumColors.centroEsquerda }} />
            <div className="h-full" style={{ width: "25%", background: spectrumColors.centro }} />
            <div className="h-full" style={{ width: "10%", background: spectrumColors.centroDireita }} />
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
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
      </main>
    </div>
  );
}