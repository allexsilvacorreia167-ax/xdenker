import { useState } from 'react';

const tabs = [
  { id: 'candidates', label: 'Candidatos' },
  { id: 'questions', label: 'Questionário' },
  { id: 'users', label: 'Usuários' },
  { id: 'spectrum', label: 'Espectro Político' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('candidates');

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header Admin */}
      <header className="bg-xdenker-dark text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center font-bold">
              X
            </div>
            <div>
              <h1 className="font-bold text-lg">XDENKER Admin</h1>
              <p className="text-xs text-slate-400">Painel de Gestão</p>
            </div>
          </div>
          <a href="/" className="text-sm text-slate-300 hover:text-white">
            ← Voltar ao site
          </a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das abas */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          {activeTab === 'candidates' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Gestão de Candidatos</h2>
                <button className="btn-primary text-sm">+ Novo Candidato</button>
              </div>
              <p className="text-slate-500 text-sm">
                Cadastre, edite, ative/inative ou exclua candidatos a Presidente e Governador (por UF).
              </p>
              <div className="mt-6 h-48 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                Tabela de candidatos (em construção)
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Editor do Questionário</h2>
              <p className="text-slate-500 text-sm mb-4">
                Perguntas de competência institucional (Verdadeiro / Falso).
              </p>
              <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                Lista de perguntas editáveis
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Usuários Cadastrados</h2>
              <p className="text-slate-500 text-sm mb-4">
                Auditoria: nome, e-mail, tokens gerados/utilizados e status de participação.
              </p>
              <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                Tabela de usuários
              </div>
            </div>
          )}

          {activeTab === 'spectrum' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Espectro Político dos Partidos</h2>
              <p className="text-slate-500 text-sm mb-4">
                Classificação ideológica volátil (Esquerda → Direita). Siglas fixas baseadas no TSE.
              </p>
              <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                Editor de espectro por partido
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
