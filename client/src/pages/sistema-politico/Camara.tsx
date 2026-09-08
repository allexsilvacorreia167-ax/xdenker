// src/pages/sistema-politico/Camara.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buscarDeputadosFederais, buscarSuplentesDoTitular } from "../../services/politicaService";
import { ChevronRight, ChevronDown } from "lucide-react";
import Hemiciclo from "../../components/Hemiciclo";

const spectrumColors: Record<string, string> = {
  Esquerda: "#C0392B",
  "Centro-Esquerda": "#E67E22",
  Centro: "#F1C40F",
  "Centro-Direita": "#52BE80",
  Direita: "#1E8449",
};

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export default function Camara() {
  const [deputados, setDeputados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroUf, setFiltroUf] = useState("Todos os estados");
  const [filtroEspectro, setFiltroEspectro] = useState("Todos os espectros");
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [suplentes, setSuplentes] = useState<Record<string, any[]>>({});

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarDeputadosFederais();
        setDeputados(dados || []);
      } catch (error) {
        console.error("Erro ao carregar deputados:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const toggleSuplentes = async (id: string) => {
    if (abertoId === id) {
      setAbertoId(null);
      return;
    }
    setAbertoId(id);
    if (!suplentes[id]) {
      const lista = await buscarSuplentesDoTitular(id);
      setSuplentes((prev) => ({ ...prev, [id]: lista }));
    }
  };

  const deputadosFiltrados = deputados.filter((p) => {
    const matchTexto =
      (p.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
      (p.partido || "").toLowerCase().includes(busca.toLowerCase()) ||
      (p.uf || "").toLowerCase().includes(busca.toLowerCase());
    const matchUf =
      filtroUf === "Todos os estados" ||
      (p.uf || "").toUpperCase() === filtroUf.toUpperCase();
    const matchEspectro =
      filtroEspectro === "Todos os espectros" ||
      (p.espectro || "").toLowerCase() === filtroEspectro.toLowerCase();
    return matchTexto && matchUf && matchEspectro;
  });

  const temFiltro =
    busca.trim().length > 0 ||
    filtroUf !== "Todos os estados" ||
    filtroEspectro !== "Todos os espectros";

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
          Câmara dos Deputados
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          Composição e deputados federais da câmara baixa
        </p>

        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { to: "/sistema-politico", label: "Visão Geral" },
            { to: "/sistema-politico/executivo", label: "Executivo" },
            { to: "/sistema-politico/senado", label: "Senado" },
            { to: "/sistema-politico/camara", label: "Câmara dos Deputados", active: true },
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
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">
                {deputados.length || 513}
              </div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">Deputados Federais</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">4</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">Anos de mandato</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">100%</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">Renovação total</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800">27</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">UFs representadas</div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">
                Composição da Câmara
              </h2>
              <span className="text-xs md:text-sm text-slate-500">
                {deputados.length || 513} cadeiras
              </span>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                Carregando hemiciclo...
              </div>
            ) : (
              <Hemiciclo
                politicos={deputados}
                destaqueIds={temFiltro ? deputadosFiltrados.map((p) => p.id) : []}
                label="CÂMARA"
                totalLabel={String(deputados.length || 513)}
                height={260}
                maxArcos={12}
                onSelect={(p) => toggleSuplentes(String(p.id))}
              />
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500 justify-center">
              {Object.entries(spectrumColors).map(([nome, cor]) => (
                <span key={nome} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: cor }} />
                  {nome}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Deputados Federais</h2>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Buscar deputado, partido..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50 flex-1 md:flex-none"
                />
                <select
                  value={filtroUf}
                  onChange={(e) => setFiltroUf(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm bg-slate-50"
                >
                  <option>Todos os estados</option>
                  {UFS.map((uf) => (
                    <option key={uf}>{uf}</option>
                  ))}
                </select>
                <select
                  value={filtroEspectro}
                  onChange={(e) => setFiltroEspectro(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm bg-slate-50"
                >
                  <option>Todos os espectros</option>
                  <option>Esquerda</option>
                  <option>Centro-Esquerda</option>
                  <option>Centro</option>
                  <option>Centro-Direita</option>
                  <option>Direita</option>
                </select>
              </div>
            </div>

            <div className="text-xs md:text-sm text-slate-500 mb-4">
              Mostrando {deputadosFiltrados.length} de {deputados.length} deputados.
            </div>

            {loading ? (
              <div className="border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                Carregando deputados...
              </div>
            ) : deputadosFiltrados.length > 0 ? (
              <div className="space-y-2">
                {deputadosFiltrados.map((p) => (
                  <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSuplentes(p.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
                        {(p.nome || "D").charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-800 truncate">{p.nome}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {p.partido} • {p.uf}
                          {p.espectro && (
                            <span
                              className="ml-2 inline-block w-2 h-2 rounded-full"
                              style={{ background: spectrumColors[p.espectro] || "#999" }}
                            />
                          )}
                        </div>
                      </div>
                      {abertoId === p.id ? (
                        <ChevronDown size={18} className="text-slate-400" />
                      ) : (
                        <ChevronRight size={18} className="text-slate-400" />
                      )}
                    </button>
                    {abertoId === p.id && (
                      <div className="px-4 pb-4 border-t bg-slate-50">
                        <div className="text-xs font-semibold text-slate-500 uppercase mt-3 mb-2">
                          Suplentes
                        </div>
                        {(suplentes[p.id] || []).length > 0 ? (
                          <div className="space-y-2">
                            {suplentes[p.id].map((s) => (
                              <div key={s.id} className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="text-slate-400">{s.tipo}:</span>
                                <span className="font-medium">{s.nome}</span>
                                <span className="text-slate-400">({s.partido})</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400">Nenhum suplente cadastrado.</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                Nenhum deputado encontrado com os filtros selecionados.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
