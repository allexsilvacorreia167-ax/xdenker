/** Mapa tocável — escolha da UF (home e pesquisas) */
const REGIONS = [
    { name: 'Norte', ufs: ['RR', 'AP', 'AM', 'PA', 'AC', 'RO', 'TO'] },
    { name: 'Nordeste', ufs: ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'] },
    { name: 'Centro-Oeste', ufs: ['MT', 'MS', 'GO', 'DF'] },
    { name: 'Sudeste', ufs: ['MG', 'ES', 'RJ', 'SP'] },
    { name: 'Sul', ufs: ['PR', 'SC', 'RS'] },
];

const COLORS = [
    'bg-sky-600', 'bg-blue-700', 'bg-cyan-600', 'bg-indigo-600',
    'bg-teal-600', 'bg-amber-500', 'bg-orange-500', 'bg-slate-500',
];

export default function BrazilMap({ selectedUF, onSelect }) {
    let colorIdx = 0;
    const colorOf = {};
    REGIONS.forEach((r) => {
        r.ufs.forEach((uf) => {
            colorOf[uf] = COLORS[colorIdx % COLORS.length];
            colorIdx += 1;
        });
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-800">Selecione um estado</h2>
                <p className="text-sm text-slate-500">
                    Toque na sigla para configurar a pesquisa e ver dados daquele estado.
                </p>
            </div>

            <div className="space-y-4">
                {REGIONS.map((region) => (
                    <div key={region.name}>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                            {region.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {region.ufs.map((uf) => {
                                const active = selectedUF === uf;
                                return (
                                    <button
                                        key={uf}
                                        type="button"
                                        onClick={() => onSelect?.(uf)}
                                        className={`
                      min-w-[3rem] px-3 py-2.5 rounded-xl text-sm font-bold transition-all
                      active:scale-95 shadow-sm
                      ${active
                                                ? 'ring-2 ring-offset-2 ring-amber-400 bg-amber-500 text-white scale-105'
                                                : `${colorOf[uf]} text-white hover:opacity-90`
                                            }
                    `}
                                    >
                                        {uf}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {selectedUF && (
                <p className="mt-4 text-center text-sm text-slate-600">
                    Estado selecionado: <strong className="text-slate-900 text-base">{selectedUF}</strong>
                </p>
            )}
        </div>
    );
}
