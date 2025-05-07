// backend/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { initSystem } from './initialization';
import { organizationRoutes } from './modules/organizations';
import { projectRoutes } from './modules/projects';
import { educcionRoutes } from './modules/templates/educciones'
// import entrevistaRoutes from './routes/entrevista.routes';
import {expertRoutes} from './modules/experts';  // Importar las rutas de experto
import {sourceRoutes} from './modules/source';  // Importar las rutas de fuentes
import { nfrRoutes } from './modules/nfr';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

if (!process.env.PORT || !process.env.DATABASE_URL || !process.env.DIRECT_URL) {
  console.error('Faltan variables de entorno requeridas.');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Definir rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', organizationRoutes);
app.use('/api/v1', projectRoutes);
app.use('/api/v1', educcionRoutes);
// app.use('/api/v1', entrevistaRoutes);
app.use('/api/v1', expertRoutes);  // Rutas de expertos
app.use('/api/v1', sourceRoutes);  // Rutas de fuentes
app.use('/api/v1', nfrRoutes);

// Ejecutar la función de inicialización antes de iniciar el servidor
initSystem()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  });

// Manejar señales de salida
process.on('SIGINT', () => {
  console.log('Cerrando el servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Servidor detenido.');
  process.exit(0);
});
