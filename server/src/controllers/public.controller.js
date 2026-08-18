import { getAggregatedResults, resetResults } from '../services/results.store.js';

export const getHomeData = async (req, res) => {
  try {
    const results = getAggregatedResults() || {};
    const uf = (req.query.uf || 'CE').toUpperCase();

    let governadorList = [];
    const govData = results.governor;

    if (govData) {
      if (Array.isArray(govData)) {
        governadorList = govData.filter(c => (c.uf || '').toUpperCase() === uf);
      } else if (typeof govData === 'object') {
        const matchingKey = Object.keys(govData).find(key => key.toUpperCase() === uf);
        if (matchingKey && Array.isArray(govData[matchingKey])) {
          governadorList = govData[matchingKey];
        } else if (govData[uf] && Array.isArray(govData[uf])) {
          governadorList = govData[uf];
        } else {
          // Fallback ultra seguro: se não achou a chave exata, pega o primeiro array que encontrar nas propriedades
          const firstValidKey = Object.keys(govData).find(k => Array.isArray(govData[k]) && govData[k].length > 0);
          if (firstValidKey) {
            governadorList = govData[firstValidKey];
          }
        }
      }
    }

    res.json({
      banner: {
        title: 'Sua Opinião Importa - Eleições 2026',
        image: '/banner.jpg',
      },
      summaryCharts: {
        presidente: results.presidente || results.president || [],
        governador: governadorList,
      },
      methodology: {
        respondents: results.totalParticipants || 0,
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
