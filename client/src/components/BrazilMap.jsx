/** Mapa tocável — escolha da UF (home e pesquisas) */
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

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
    const [showMap, setShowMap] = useState(!!selectedUF);

    let colorIdx = 0;
    const colorOf = {};
    REGIONS.forEach((r) => {
        r.ufs.forEach((uf) => {
            colorOf[uf] = COLORS[colorIdx % COLORS.length];
            colorIdx += 1;
        });
    });

    const handleSelect = (uf) => {
        onSelect?.(uf);
        setShowMap(true);
    };

    const handleBack = () => {
        setShowMap(false);
    };

    // ========== MODO MAPA ILUSTRADO ==========
    if (showMap && selectedUF) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-3">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Trocar estado
                    </button>
                    <span className="text-sm font-semibold text-slate-700">
                        Estado: <strong className="text-amber-600">{selectedUF}</strong>
                    </span>
                </div>

                <div className="flex justify-center">
                    <img
                        src={`/${selectedUF.toLowerCase()}-estado.png`}
                        alt={`Mapa de ${selectedUF}`}
                        className="w-full max-w-[320px] max-h-[38vh] object-contain drop-shadow-xl"
                        style={{
                            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.18))',
                        }}
                        onError={(e) => {
                            // fallback caso a imagem ainda não exista
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            </div>
        );
    }

    // ========== MODO SELEÇÃO DE ÍCONES ==========
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
                                        onClick={() => handleSelect(uf)}
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
        </div>
    );
}