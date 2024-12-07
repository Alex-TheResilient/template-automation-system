// backend/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Importar cors
import authRoutes from './src/routes/authRoutes'; // Importar las rutas de autenticación
import { createAdminUser } from './src/services/authService'; // Importar la función para crear el admin
import dotenv from 'dotenv'; // Importar dotenv

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const app = express();
const port = process.env.PORT || 5000; // Usar el puerto desde la variable de entorno, o 5000 por defecto

// Habilitar CORS
app.use(cors());  // Esto permite que todas las solicitudes de otros orígenes (por ejemplo, el frontend) sean aceptadas

app.use(bodyParser.json());
app.use('/auth', authRoutes);  // Definir las rutas de autenticación

// Crear el usuario admin si no existe
const initAdmin = async () => {
  try {
    await createAdminUser();  // Llamar a la función que crea el usuario admin
    console.log('Usuario admin creado o ya existe.');
  } catch (error) {
    console.error('Error al crear el usuario admin:', error);
  }
};

// Ejecutar la función de inicialización antes de iniciar el servidor
initAdmin().then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
});
