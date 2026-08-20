import {
  registerSurveyResult,
  hasUserVoted,
  getAggregatedResults,
} from '../services/results.store.js';
import {
  getPresidentCandidates,
  getGovernorCandidates,
  getInstitutionalQuestions,
  getSpectrumForParty,
} from '../services/admin.store.js';

/**
 * Questionário usa dados do ADM (candidatos + perguntas + espectro)
 */

export const startQuestionnaire = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'] || 'anonymous';
    if (await hasUserVoted(userId)) {
      return res.status(400).json({ error: 'Você já participou desta pesquisa', hasCompleted: true });
    }

    const stateUF = (req.body?.stateUF || req.query?.uf || 'CE').toString().toUpperCase().slice(0, 2);

    const questions = await getInstitutionalQuestions(true);
    const presidents = await getPresidentCandidates(true);
    const governors = await getGovernorCandidates(stateUF, true);

    const presidentsWithSpectrum = await Promise.all(
      presidents.map(async (c) => ({
        id: c.id, name: c.name, party: c.party, number: c.number,
        spectrum: await getSpectrumForParty(c.party),
      }))
    );
    const governorsWithSpectrum = await Promise.all(
      governors.map(async (c) => ({
        id: c.id, name: c.name, party: c.party, number: c.number,
        spectrum: await getSpectrumForParty(c.party),
      }))
    );

    res.json({
      message: 'Questionário iniciado',
      stages: [
        { number: 1, title: 'Competência Institucional', type: 'true_false' },
        { number: 2, title: 'Percepção Social', type: 'scale' },
        { number: 3, title: 'Escolha Legislativa e Executiva', type: 'selection' },
      ],
      currentStage: 1,
      questions: {
        institutional: questions.map((q) => ({ id: q.id, text: q.text })),
        sectors: [
          { key: 'seguranca', text: 'Como você avalia a segurança pública no seu estado?' },
          { key: 'saude', text: 'Como você avalia o sistema de saúde pública?' },
          { key: 'educacao', text: 'Como você avalia a educação pública?' },
          { key: 'economia', text: 'Como você avalia a economia e o emprego na sua região?' },
          { key: 'infraestrutura', text: 'Como você avalia a infraestrutura (rodovias, energia, saneamento)?' },
          { key: 'combateCorrupcao', text: 'Como você avalia o combate à corrupção no país?' },
        ],
        candidates: {
          president: presidentsWithSpectrum,
          governor: governorsWithSpectrum,
        },
      },
      // gabarito só no servidor — usado no calculate
      _meta: { questionIds: questions.map((q) => q.id) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao iniciar questionário' });
  }
};

export const submitStage = async (req, res) => {
  try {
    const { stageNumber } = req.params;
    res.json({
      message: `Etapa ${stageNumber} registrada`,
      nextStage: Number(stageNumber) < 3 ? Number(stageNumber) + 1 : null,
      completed: Number(stageNumber) === 3,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar etapa' });
  }
};

export const getQuestionnaireStatus = async (req, res) => {
  try {
    const userId = req.user?.id || 'anonymous';
    const voted = await hasUserVoted(userId);
    res.json({
      hasStarted: voted,
      currentStage: null,
      hasCompleted: voted,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
};

/**
 * Motor de Coerência:
 * - Acertos nas perguntas institucionais (ADM)
 * - Espectro do partido do Presidente vs Governador (ADM)
 * - Cruzamento ideológico
 * - Também registra Deputado Federal, Estadual e Senador (nome + sigla)
 */
export const calculateCoherence = async (req, res) => {
  try {
    const {
      institutionalAnswers = [],
      sectorAnswers = {},
      presidentId,
      governorId,
      stateUF = 'CE',
      depFederal = null,   // { name, party }
      depEstadual = null,  // { name, party }
      senador = null,      // { name, party }
    } = req.body;

    const userId = req.user?.id || `user-${Date.now()}`;
    const fullName = req.user?.fullName || 'Participante';

    if (await hasUserVoted(userId)) {
      return res.status(400).json({ error: 'Você já participou desta pesquisa' });
    }

    // Gabarito dinâmico do ADM
    const questions = await getInstitutionalQuestions(true);
    const correctMap = Object.fromEntries(questions.map((q) => [q.id, q.correctAnswer]));

    const evaluated = institutionalAnswers.map((a) => ({
      ...a,
      isCorrect: correctMap[a.id] === a.answer,
    }));
    const correctCount = evaluated.filter((a) => a.isCorrect).length;
    const totalQuestions = questions.length || 1;
    const knowledgePercent = Math.round((correctCount / totalQuestions) * 100);

    // Candidatos e espectro (do ADM)
    const presidents = await getPresidentCandidates(true);
    const governors = await getGovernorCandidates(stateUF, true);
    const pres = presidents.find((c) => c.id === presidentId);
    const gov = governors.find((c) => c.id === governorId);

    const presSpectrum = pres ? await getSpectrumForParty(pres.party) : 'Centro';
    const govSpectrum = gov ? await getSpectrumForParty(gov.party) : 'Centro';

    // Espectro dos legislativos (sigla escolhida manualmente pelo usuário)
    const depFederalSpectrum = depFederal?.party ? await getSpectrumForParty(depFederal.party) : null;
    const depEstadualSpectrum = depEstadual?.party ? await getSpectrumForParty(depEstadual.party) : null;
    const senadorSpectrum = senador?.party ? await getSpectrumForParty(senador.party) : null;

    // Escala numérica do espectro
    const SPECTRUM_SCORE = {
      Esquerda: 1,
      'Centro-Esquerda': 2,
      Centro: 3,
      'Centro-Direita': 4,
      Direita: 5,
    };
    const presScore = SPECTRUM_SCORE[presSpectrum] || 3;
    const govScore = SPECTRUM_SCORE[govSpectrum] || 3;

    // Inclui legislativos no cálculo de coerência ideológica, quando preenchidos
    const legislativeScores = [depFederalSpectrum, depEstadualSpectrum, senadorSpectrum]
      .filter(Boolean)
      .map((s) => SPECTRUM_SCORE[s] || 3);

    const allScores = [presScore, govScore, ...legislativeScores];
    const avgScore = allScores.reduce((s, v) => s + v, 0) / allScores.length;
    const spectrumDistance =
      allScores.reduce((sum, v) => sum + Math.abs(v - avgScore), 0) / allScores.length;

    // Coerência: 70% conhecimento + 30% alinhamento ideológico (distância 0 = max)
    const alignmentBonus = Math.max(0, 30 - spectrumDistance * 10);
    let coherenceScore = Math.round(knowledgePercent * 0.7 + alignmentBonus);
    coherenceScore = Math.min(98, Math.max(15, coherenceScore));

    let label = 'Eleitor com Baixa Coerência Detectada';
    if (coherenceScore >= 70) label = 'Eleitor Altamente Consciente e Coerente';
    else if (coherenceScore >= 40) label = 'Eleitor Moderadamente Consciente';

    const result = await registerSurveyResult({
      userId, fullName,
      institutionalAnswers: evaluated,
      sectorAnswers,
      presidentId, governorId, stateUF, coherenceScore,
      depFederalName: depFederal?.name || null,
      depFederalParty: depFederal?.party || null,
      depEstadualName: depEstadual?.name || null,
      depEstadualParty: depEstadual?.party || null,
      senadorName: senador?.name || null,
      senadorParty: senador?.party || null,
    });

    if (!result.ok) return res.status(400).json({ error: result.error });

    const live = await getAggregatedResults();

    res.json({
      score: coherenceScore,
      label,
      knowledgePercent,
      correctCount,
      totalQuestions,
      spectrum: {
        president: { party: pres?.party, spectrum: presSpectrum },
        governor: { party: gov?.party, spectrum: govSpectrum },
        depFederal: depFederal ? { party: depFederal.party, spectrum: depFederalSpectrum } : null,
        depEstadual: depEstadual ? { party: depEstadual.party, spectrum: depEstadualSpectrum } : null,
        senador: senador ? { party: senador.party, spectrum: senadorSpectrum } : null,
        aligned: spectrumDistance <= 1,
      },
      choices: { president: presidentId, governor: governorId },
      updatedResults: {
        totalParticipants: live.totalParticipants,
        president: live.president,
        governor: live.governor[stateUF] || [],
        sectorEvaluation: live.sectorEvaluation,
        politicalKnowledgeIndex: live.politicalKnowledgeIndex,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no cálculo de coerência' });
  }
};