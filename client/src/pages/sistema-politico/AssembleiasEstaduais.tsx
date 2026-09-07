// src/pages/sistema-politico/AssembleiasEstaduais.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buscarDeputadosEstaduais, buscarSuplentesDoTitular } from "../../services/politicaService";
import { ChevronRight, ChevronDown } from "lucide-react";

const spectrumColors: Record<string, string> = {
  "Esquerda": "#C0392B",
  "Centro-Esquerda": "#E67E22",
  "Centro": "#F1C40F",
  "Centro-Direita": "#52BE80",
  "Direita": "#1E8449",
};

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function AssembleiasEstaduais() {
  const [estadoSelecionado, setEstadoSelecionado] = useState("SP");
  const [deputados, setDeputados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [suplentes, setSuplentes] = useState<Record<string, any[]>>({});

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        // @ts-ignore
        const dados = await buscarDeputadosEstaduais(estadoSelecionado);
        setDeputados(dados || []);
      } catch (error) {
        console.error("Erro ao carregar deputados estaduais:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [estadoSelecionado]);

  const toggleSuplentes = async (id: string) => {
    if (abertoId === id) { setAbertoId(null); return; }
    setAbertoId(id);
    if (!suplentes[id]) {
      const lista = await buscarSuplentesDoTitular(id);
      setSuplentes((prev) => ({ ...prev, [id]: lista }));
    }
  };

  const deputadosFiltrados = deputados.filter((p) =>
    (p.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
    (p.partido || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
        <Link to="/sistema-politico" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">← Voltar à Visão Geral</Link>
        <h1 className="text-base md:text-lg font-bold text-slate-800 mb-1">Assembleias Estaduais</h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">Composição e deputados das assembleias legislativas estaduais</p>

        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { to: "/sistema-politico", label: "Visão Geral" },
            { to: "/sistema-politico/executivo", label: "Executivo Federal" },
            { to: "/sistema-politico/senado", label: "Senado" },
            { to: "/sistema-politico/camara", label: "Câmara dos Deputados" },
            { to: "/sistema-politico/assembleias", label: "Assembleias Estaduais", active: true },
          ].map((tab) => (
            <Link key={tab.to} to={tab.to}
              className={"flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors " + (tab.active ? "bg-slate-800 text-white" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300")}>
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-4">Selecione um Estado</h2>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {estados.map((uf) => (
                <button key={uf} onClick={() => setEstadoSelecionado(uf)}
                  className={"px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-colors " + (estadoSelecionado === uf ? "bg-slate-800 text-white shadow-sm" : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100")}>
                  {uf}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Assembleia Legislativa — {estadoSelecionado}</h2>
              <span className="text-xs md:text-sm text-slate-500">{deputados.length} deputados</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl h-40 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <div className="text-3xl font-bold text-slate-600">{estadoSelecionado}</div>
                <div className="text-xs mt-1">{deputados.length} cadeiras</div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <h2 className="text-sm md:text-base font-bold text-slate-800">Deputados Estaduais — {estadoSelecionado}</h2>
              <input type="text" placeholder="Buscar deputado estadual..." value={busca} onChange={(e) => setBusca(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50 w-full md:w-auto" />
            </div>

            {loading ? (
              <div className="border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">Carregando deputados estaduais...</div>
            ) : deputadosFiltrados.length > 0 ? (
              <div className="space-y-2">
                {deputadosFiltrados.map((p) => (
                  <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button onClick={() => toggleSuplentes(p.id)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">{(p.nome || "D").charAt(0)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-800 truncate">{p.nome}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {p.partido} • {p.uf}
                          {p.espectro && <span className="ml-2 inline-block w-2 h-2 rounded-full" style={{ background: spectrumColors[p.espectro] || "#999" }} />}
                        </div>
                      </div>
                      {abertoId === p.id ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                    </button>
                    {abertoId === p.id && (
                      <div className="px-4 pb-4 border-t bg-slate-50">
                        <div className="text-xs font-semibold text-slate-500 uppercase mt-3 mb-2">Suplentes</div>
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
              <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">Nenhum deputado estadual encontrado para {estadoSelecionado}.</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
