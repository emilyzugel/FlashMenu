import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import companiesRoutes from './routes/companies.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar ao MongoDB
connectDB();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por windowMs
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes - IMPORTANTE: Esta linha deve estar aqui
app.use('/api/companies', companiesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API FlashMenu está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota simples de teste
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Teste OK! MongoDB conectado',
    data: {
      companies: ['pizzaria-italia', 'hamburgueria-artesanal']
    }
  });
});

// 404 handler - CORRIGIDO
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada: ' + req.originalUrl
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🎯 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏪 Companies: http://localhost:${PORT}/api/companies`);
  console.log(`🍕 Pizzaria: http://localhost:${PORT}/api/companies/pizzaria-italia`);
});
