// src/pages/sistema-politico/ExecutivoFederal.tsx
// Agora com 3 esferas: Federal | Estadual | Municipal
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buscarExecutivo } from "../../services/politicaService";

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

type Esfera = "federal" | "estadual" | "municipal";

export default function ExecutivoFederal() {
  const [esfera, setEsfera] = useState<Esfera>("federal");
  const [uf, setUf] = useState("CE");
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const dados = await buscarExecutivo(
          esfera,
          esfera === "federal" ? null : uf
        );
        setLista(dados || []);
      } catch (error) {
        console.error("Erro ao carregar executivo:", error);
        setLista([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [esfera, uf]);

  // Federal
  const presidente = lista.find((p) => p.cargo === "Presidente");
  const vice = lista.find((p) => p.cargo === "Vice-Presidente");
  const ministros = lista.filter((p) => p.cargo === "Ministro");

  // Estadual
  const governador = lista.find((p) => p.cargo === "Governador");
  const viceGov = lista.find((p) => p.cargo === "Vice-Governador");
  const secretarios = lista.filter((p) => p.cargo === "Secretário" || p.cargo === "Secretario");

  // Municipal
  const prefeito = lista.find((p) => p.cargo === "Prefeito");
  const vicePref = lista.find((p) => p.cargo === "Vice-Prefeito");
  const secretariosMun = lista.filter(
    (p) => p.cargo === "Secretário Municipal" || p.cargo === "Secretario Municipal"
  );

  const abasEsfera: { id: Esfera; label: string }[] = [
    { id: "federal", label: "Federal" },
    { id: "estadual", label: "Estadual" },
    { id: "municipal", label: "Municipal" },
  ];

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
          Executivo
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          Federal, estadual e municipal
        </p>

        {/* Abas principais do sistema político */}
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 mb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { to: "/sistema-politico", label: "Visão Geral" },
            { to: "/sistema-politico/executivo", label: "Executivo", active: true },
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

        {/* Abas Federal / Estadual / Municipal */}
        <div className="flex gap-2 mb-6">
          {abasEsfera.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setEsfera(a.id)}
              className={
                "px-4 py-2 rounded-lg text-sm font-semibold transition-colors " +
                (esfera === a.id
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300")
              }
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* Seletor de UF (estadual e municipal) */}
        {(esfera === "estadual" || esfera === "municipal") && (
          <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6">
            <div className="text-xs font-semibold text-slate-500 mb-2">
              Selecione o estado
            </div>
            <div className="flex flex-wrap gap-1.5">
              {UFS.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUf(u)}
                  className={
                    "w-10 h-9 rounded-lg text-xs font-bold transition-colors " +
                    (uf === u
                      ? "bg-slate-800 text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100")
                  }
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* ===================== FEDERAL ===================== */}
          {esfera === "federal" && (
            <>
              <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
                <h2 className="text-sm md:text-base font-bold text-slate-800 mb-4">
                  Presidente da República
                </h2>
                {loading ? (
                  <div className="text-sm text-slate-400">Carregando...</div>
                ) : presidente ? (
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-2xl">
                      {(presidente.nome || "P").charAt(0)}
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xl md:text-2xl font-bold text-slate-800">
                        {presidente.nome}
                      </div>
                      <div className="text-xs md:text-sm text-slate-500 mt-1">
                        {presidente.partido || ""}{" "}
                        {presidente.data_inicio
                          ? "• desde " + presidente.data_inicio
                          : ""}
                      </div>
                      {presidente.espectro && (
                        <div className="mt-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{
                              background:
                                spectrumColors[presidente.espectro] || "#666",
                            }}
                          >
                            {presidente.espectro}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">
                    Presidente ainda não cadastrado. Cadastre no Admin → Executivo.
                  </div>
                )}
              </section>

              {vice && (
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
                  <h2 className="text-sm md:text-base font-bold text-slate-800 mb-3">
                    Vice-Presidente
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                      {(vice.nome || "V").charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{vice.nome}</div>
                      <div className="text-xs text-slate-500">{vice.partido}</div>
                    </div>
                  </div>
                </section>
              )}

              <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm md:text-base font-bold text-slate-800">
                    Ministros de Estado
                  </h2>
                  <span className="text-xs md:text-sm text-slate-500">
                    {ministros.length > 0 ? ministros.length + " pastas" : "—"}
                  </span>
                </div>
                {loading ? (
                  <div className="text-sm text-slate-400">Carregando...</div>
                ) : ministros.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {ministros.map((m) => (
                      <div
                        key={m.id}
                        className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
                            {(m.nome || "M").charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-800 truncate">
                              {m.nome}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {m.pasta || "Ministro"}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-slate-500">
                                {m.partido || ""}
                              </span>
                              {m.espectro && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{
                                    background:
                                      spectrumColors[m.espectro] || "#999",
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                    Nenhum ministro cadastrado ainda.
                  </div>
                )}
              </section>
            </>
          )}

          {/* ===================== ESTADUAL ===================== */}
          {esfera === "estadual" && (
            <>
              <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
                <h2 className="text-sm md:text-base font-bold text-slate-800 mb-4">
                  Governador — {uf}
                </h2>
                {loading ? (
                  <div className="text-sm text-slate-400">Carregando...</div>
                ) : governador ? (
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-2xl">
                      {(governador.nome || "G").charAt(0)}
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xl md:text-2xl font-bold text-slate-800">
                        {governador.nome}
                      </div>
                      <div className="text-xs md:text-sm text-slate-500 mt-1">
                        {governador.partido || ""}{" "}
                        {governador.data_inicio
                          ? "• desde " + governador.data_inicio
                          : ""}
                      </div>
                      {governador.espectro && (
                        <div className="mt-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{
                              background:
                                spectrumColors[governador.espectro] || "#666",
                            }}
                          >
                            {governador.espectro}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">
                    Governador de {uf} ainda não cadastrado no Admin.
                  </div>
                )}
              </section>

              {viceGov && (
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
                  <h2 className="text-sm md:text-base font-bold text-slate-800 mb-3">
                    Vice-Governador
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                      {(viceGov.nome || "V").charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{viceGov.nome}</div>
                      <div className="text-xs text-slate-500">{viceGov.partido}</div>
                    </div>
                  </div>
                </section>
              )}

              <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm md:text-base font-bold text-slate-800">
                    Secretários de Estado — {uf}
                  </h2>
                  <span className="text-xs md:text-sm text-slate-500">
                    {secretarios.length > 0 ? secretarios.length + " pastas" : "—"}
                  </span>
                </div>
                {loading ? (
                  <div className="text-sm text-slate-400">Carregando...</div>
                ) : secretarios.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {secretarios.map((s) => (
                      <div
                        key={s.id}
                        className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
                            {(s.nome || "S").charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-800 truncate">
                              {s.nome}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {s.pasta || "Secretário"}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-slate-500">
                                {s.partido || ""}
                              </span>
                              {s.espectro && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{
                                    background:
                                      spectrumColors[s.espectro] || "#999",
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                    Nenhum secretário cadastrado para {uf}.
                  </div>
                )}
              </section>
            </>
          )}

          {/* ===================== MUNICIPAL ===================== */}
          {esfera === "municipal" && (
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10 text-center">
              <div className="text-4xl mb-3 opacity-40">🏛</div>
              <h2 className="text-base font-bold text-slate-800 mb-2">
                Executivo Municipal — {uf}
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Prefeitos, vices e secretários municipais serão cadastrados em
                breve. A estrutura já está preparada no banco (esfera =
                municipal).
              </p>
              {(prefeito || secretariosMun.length > 0) && (
                <div className="mt-6 text-left max-w-lg mx-auto space-y-3">
                  {prefeito && (
                    <div className="border rounded-xl p-4">
                      <div className="font-medium">{prefeito.nome}</div>
                      <div className="text-xs text-slate-500">Prefeito</div>
                    </div>
                  )}
                  {secretariosMun.map((s) => (
                    <div key={s.id} className="border rounded-xl p-3 text-sm">
                      {s.nome} — {s.pasta}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
