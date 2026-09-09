export default function MetodologiaPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-xdenker-dark mb-6">Metodologia</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        {/* Aviso legal / natureza do produto */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-amber-900">
            Natureza desta plataforma
          </h2>
          <p className="text-slate-700">
            O XDENKER <strong>não realiza pesquisa eleitoral metodológica</strong> nos
            termos exigidos para institutos de pesquisa eleitoral (amostragem
            probabilística, margem de erro, registro em órgãos competentes, etc.).
          </p>
          <p className="text-slate-700 mt-3">
            As interações internas do site são de caráter <strong>individual</strong>,
            educativo e informativo. Quando resultados de escolhas internas são
            exibidos de forma agregada, isso ocorre apenas em{" "}
            <strong>números absolutos</strong> (contagens de participantes ou de
            escolhas registradas na plataforma), <strong>sem pretensão de
              representar o eleitorado</strong>, projeções de voto ou intenções de
            voto da população em geral.
          </p>
        </section>

        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Como funciona o questionário interno</h2>
          <p className="text-slate-600">
            O questionário é um instrumento de reflexão individual, dividido em
            etapas (por exemplo: competência institucional, percepção social e
            escolha legislativa/executiva). As respostas pertencem ao próprio
            usuário e servem para calcular indicadores pessoais de coerência e
            alinhamento — não para medir o comportamento eleitoral da sociedade.
          </p>
        </section>

        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Índice de Coerência Política</h2>
          <p className="text-slate-600">
            Após a conclusão, o sistema cruza o espectro político associado aos
            partidos/candidatos escolhidos com as respostas do usuário, gerando
            um percentual <strong>individual</strong> de coerência. Esse índice
            não constitui ranking eleitoral nem pesquisa de intenção de voto.
          </p>
        </section>

        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">
            Números absolutos nas escolhas internas
          </h2>
          <p className="text-slate-600">
            Quando a plataforma mostra quantas pessoas escolheram determinado
            político ou espectro nas ferramentas internas, os valores são{" "}
            <strong>absolutos</strong> (ex.: “X registros na base do site”), e não
            percentuais amostrais com margem de erro. Não há generalização para
            o conjunto dos eleitores brasileiros.
          </p>
        </section>

        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Sistema Político e Judiciário</h2>
          <p className="text-slate-600">
            As seções de <strong>Sistema Político</strong> e{" "}
            <strong>Judiciário</strong> têm finalidade de transparência e
            educação cívica: organizar e exibir informações sobre cargos,
            instituições e composição (Executivo, Legislativo, tribunais e
            órgãos correlatos), com base em cadastros mantidos na plataforma e,
            quando aplicável, em dados públicos de referência (como listagens
            eleitorais oficiais para fins de identificação de nomes e cargos).
          </p>
          <p className="text-slate-600 mt-3">
            Essas páginas <strong>não substituem</strong> fontes oficiais
            (TSE, tribunais, Diário Oficial, etc.) e podem ser atualizadas
            manualmente pela administração do site.
          </p>
        </section>

        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Fonte de dados de candidatos</h2>
          <p className="text-slate-600">
            Para autocompletar e identificação de nomes de Deputado Federal,
            Estadual, Senador e cargos correlatos, a plataforma pode utilizar
            bases derivadas de dados públicos do TSE e cadastros internos. O uso
            é informativo e de organização do conteúdo — não configura divulgação
            de pesquisa eleitoral regulamentada.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Resumo para o usuário</h2>
          <ul className="list-disc pl-5 text-slate-600 space-y-2">
            <li>Não é instituto de pesquisa eleitoral.</li>
            <li>Questionário e coerência são individuais.</li>
            <li>Agregados internos, quando existem, são em números absolutos.</li>
            <li>Sistema político e judiciário são conteúdo informativo/educativo.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}