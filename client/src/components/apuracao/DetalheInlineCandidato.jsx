/**
 * Conteúdo exibido dentro do accordion, ao expandir um candidato.
 * Reutilizado por PainelExecutivoLateral (Vice) e RankingLegislativo (Suplentes).
 *
 * Vice/Suplentes dependem de dado real do TSE ainda não integrado — em vez
 * de inventar nomes fictícios (arriscado num produto de informação
 * eleitoral), mostramos claramente que a informação ainda não está disponível.
 */
export default function DetalheInlineCandidato({ candidato, tipo }) {
  return (
    <dl className="text-xs px-1 pb-1 space-y-1.5">
      {candidato.votes !== undefined && candidato.votes !== null && (
        <Campo label="Votos" valor={candidato.votes.toLocaleString('pt-BR')} />
      )}
      {candidato.spectrum && <Campo label="Espectro" valor={candidato.spectrum} />}
      <Campo label={tipo === 'legislativo' ? 'Suplentes' : 'Vice'} indisponivel />
    </dl>
  );
}

function Campo({ label, valor, indisponivel }) {
  return (
    <div className="flex justify-between border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
      <dt className="text-slate-400">{label}</dt>
      <dd className={indisponivel ? 'text-slate-300 italic' : 'font-semibold text-slate-700'}>
        {indisponivel ? 'Não disponível ainda' : valor}
      </dd>
    </div>
  );
}
