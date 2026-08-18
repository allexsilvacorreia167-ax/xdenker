import { getAggregatedResults, resetResults } from '../services/results.store.js';

export const getHomeData = async (req, res) => {
  try {
    const results = getAggregatedResults();
    const uf = (req.query.uf || 'CE').toUpperCase();

    // Busca inteligente que cobre todos os formatos possíveis de armazenamento
    let governadorList = [];
    const govData = results.governor;

    if (govData) {
      if (Array.isArray(govData)) {
        // Se estiver em formato de array único, filtra pela UF do candidato
        governadorList = govData.filter(c => (c.uf || '').toUpperCase() === uf);
      } else if (typeof govData === 'object') {
        // Se estiver em formato de objeto/dicionário por estado (ex: { CE: [...], SP: [...] })
        // Tenta achar tanto em maiúsculo, minúsculo, ou busca nas chaves do objeto
        const matchingKey = Object.keys(govData).find(key => key.toUpperCase() === uf);
        if (matchingKey) {
          governadorList = govData[matchingKey];
        } else if (govData[uf]) {
          governadorList = govData[uf];
        } else if (govData[uf.toLowerCase()]) {
          governadorList = govData[uf.toLowerCase()];
        } else {
          // Se não achar a chave exata da UF, pega a primeira disponível ou array vazio
          governadorList = [];
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
