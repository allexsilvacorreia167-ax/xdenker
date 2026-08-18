import { getAggregatedResults, resetResults } from '../services/results.store.js';

export const getHomeData = async (req, res) => {
  try {
    const results = await getAggregatedResults();
    const uf = (req.query.uf || 'CE').toString().toUpperCase().slice(0, 2);

    res.json({
      banner: {
        title: 'Sua Opinião Importa - Eleições 2026',
        image: '/banner.jpg',
      },
      summaryCharts: {
        presidente: results.president,
        governador: results.governor[uf] || [],
        uf,
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
    const results = await getAggregatedResults();
    const uf = (req.query.uf || 'CE').toString().toUpperCase().slice(0, 2);

    res.json({
      totalParticipants: results.totalParticipants,
      uf,
      intentionLines: {
        presidente: results.president,
        governador: results.governor,
        governadorUF: results.governor[uf] || [],
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
  await resetResults();
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
