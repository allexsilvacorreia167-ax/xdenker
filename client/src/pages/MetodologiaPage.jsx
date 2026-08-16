export default function MetodologiaPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-xdenker-dark mb-6">Metodologia</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Como funciona a pesquisa</h2>
          <p className="text-slate-600">
            O questionário é dividido em três etapas obrigatórias: Competência Institucional,
            Percepção Social e Escolha Legislativa/Executiva.
          </p>
        </section>

        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Índice de Coerência Política</h2>
          <p className="text-slate-600">
            Após a conclusão, o motor algorítmico cruza o espectro político do partido
            legislativo escolhido com as respostas institucionais e o voto executivo,
            gerando um percentual individual de consciência e coerência.
          </p>
        </section>

        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Fonte de dados legislativos</h2>
          <p className="text-slate-600">
            A base de candidatos a Deputado Federal, Estadual e Senador utiliza
            referência do TSE para o componente de autocompletar.
          </p>
        </section>
      </div>
    </div>
  );
}
