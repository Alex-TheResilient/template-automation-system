// backend/app.ts
import express from 'express';
import cors from 'cors'; // Importar cors
import authRoutes from './src/routes/authRoutes'; // Importar las rutas de autenticación
import { createAdminUser } from './src/services/authService'; // Importar la función para crear el admin
import dotenv from 'dotenv'; // Importar dotenv
import organizacionRoutes from './src/routes/organizacion.routes';
import { initializeMainOrganization } from './src/services/organizacion.service';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const app = express();
const port = process.env.PORT || 5000; // Usar el puerto desde la variable de entorno, o 5000 por defecto

// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.originalUrl}`);
  next();
});


// Definir rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', organizacionRoutes);
console.log('Rutas de organización registradas en /api/v1/organizations');

// Crear el usuario admin si no existe
const initSystem = async () => {
  try {
    // Inicializar usuario administrador
    await createAdminUser();
    console.log('Usuario administrador inicializado.');

    // Inicializar organización principal
    await initializeMainOrganization();
    console.log('Organización principal inicializada.');
  } catch (error) {
    console.error('Error durante la inicialización del sistema:', error);
    process.exit(1); // Salir si ocurre un error crítico
  }
};

// Ejecutar la función de inicialización antes de iniciar el servidor
initSystem().then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}).catch((error) => {
  console.error(`Error al iniciar el servidor: ${(error as Error).message}`);
  process.exit(1); // Salir del proceso si algo falla
});
