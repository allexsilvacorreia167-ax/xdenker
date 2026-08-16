import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import publicRoutes from './routes/public.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import researchRoutes from './routes/research.routes.js';
import tseRoutes from './routes/tse.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
app.use('/api', publicRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tse', tseRoutes);

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
  console.log(`🚀 XDENKER Server rodando em http://localhost:${PORT}`);
});
