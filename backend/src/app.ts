// backend/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import { initSystem } from './initialization';
import authRoutes from './routes/authRoutes';
import organizacionRoutes from './routes/organizacion.routes';
import proyectoRoutes from './routes/proyecto.routes';
import entrevistaRoutes from './routes/entrevista.routes';
import expertoRoutes from './routes/experto.routes';  // Importar las rutas de experto

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
app.use('/api/v1/organizations', organizacionRoutes);
app.use('/api/v1', proyectoRoutes); // Rutas de proyectos y educciones
app.use('/api/v1', entrevistaRoutes);
app.use('/api/v1', proyectoRoutes);  // Rutas de proyectos
app.use('/api/v1', expertoRoutes);  // Rutas de expertos

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
