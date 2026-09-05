import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import publicRoutes from './routes/public.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminAuthRoutes from './routes/adminAuth.routes.js';
import researchRoutes from './routes/research.routes.js';
import tseRoutes from './routes/tse.routes.js';
import apuracaoRoutes from './routes/apuracao.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Aceita múltiplas origens, separadas por vírgula em FRONTEND_URL
// Ex: FRONTEND_URL=https://xdenker.com.br,https://xdenker.vercel.app,http://localhost:5173
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (ex: Postman, apps mobile) e as origens da lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para origem: ${origin}`));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'XDENKER API', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api', publicRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tse', tseRoutes);
app.use('/api/apuracao', apuracaoRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`✌️ 😎 XDENKER Server rodando em http://localhost:${PORT}`);
});