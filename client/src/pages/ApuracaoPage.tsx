import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Página completa de Apuração em Tempo Real (/apuracao).
 *
 * TODO (próxima etapa): abas por cargo (Presidente, Governador, Senador,
 * Dep. Federal, Dep. Estadual), filtro de UF, MapaEspectroPolitico.jsx
 * (desktop) e BarraEspectro.jsx (mobile + legislativo). Ver seção 3.3 de
 * spec-apuracao-tse.md para o desenho completo já fechado.
 *
 * Por ora, placeholder funcional para a rota existir de verdade e já
 * poder ser navegada a partir do botão "Ver completa" (Home) e do item
 * "Apuração" no menu hambúrguer.
 */
export default function ApuracaoPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen pb-20 px-4 md:px-8 pt-6 max-w-5xl mx-auto">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <h1 className="text-lg font-bold text-slate-800 mb-2">
        Apuração em Tempo Real — Eleições 2026
      </h1>
      <p className="text-sm text-slate-500">
        Página completa em construção — abas de cargo, mapa por espectro
        político e filtros por UF chegam na próxima etapa.
      </p>
    </div>
  );
}
