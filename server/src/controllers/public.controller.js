import { getAggregatedResults, resetResults } from '../services/results.store.js';

export const getHomeData = async (req, res) => {
  try {
    const results = getAggregatedResults();

    res.json({
      banner: {
        title: 'Sua Opinião Importa - Eleições 2026',
        image: '/banner.jpg',
      },
      summaryCharts: {
        presidente: results.president,
        governador: results.governor['CE'] || [],
      },
      methodology: {
        respondents: results.totalParticipants,
        marginOfError: results.totalParticipants > 0 ? '±1.5%' : '—',
      },
      hasVoted: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao carregar dados da home' });
  }
};

export const getGlobalResults = async (req, res) => {
  try {
    const results = getAggregatedResults();

    res.json({
      totalParticipants: results.totalParticipants,
      intentionLines: {
        presidente: results.president,
        governador: results.governor,
      },
      politicalKnowledgeIndex: results.politicalKnowledgeIndex,
      sectorEvaluation: results.sectorEvaluation,
      recentSurveys: results.recentSurveys,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao carregar resultados' });
  }
};

/** POST /api/reset-results — só em desenvolvimento */
export const resetAllResults = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Indisponível em produção' });
  }
  resetResults();
  res.json({ message: 'Resultados zerados', totalParticipants: 0 });
};

export const getBlogPosts = async (req, res) => {
  try {
    res.json({ posts: [] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar blog' });
  }
};

export const getContactInfo = async (req, res) => {
  try {
    res.json({
      whatsapp: 'https://wa.me/5500000000000',
      instagram: 'https://instagram.com/xdenker',
      x: 'https://x.com/xdenker',
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar contato' });
  }
};
