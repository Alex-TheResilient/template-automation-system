// backend/src/routes/authRoutes.ts
import express, { Request, Response } from 'express'; // Importando Request y Response
import { authenticateUser, createAdminUser } from '../services/authService';
import { authenticateToken } from '../shared/middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Ruta para login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  console.log("Received login request with:", { username, password }); // Verifica qué está recibiendo

  try {
      const token = await authenticateUser(username, password);
      res.json({ token });
  } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: (error as Error).message });
  }
});

// Ruta para crear un primer usuario admin (solo si no existe aún)
router.post('/create-admin', async (req: Request, res: Response) => {
  try {
    // Verificar si el admin ya existe
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      return res.status(400).json({ message: 'El usuario admin ya existe.' });
    }

    const user = await createAdminUser(); // Crear el usuario admin
    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Rutas protegidas (requieren JWT)
router.get('/protected', authenticateToken, (req: Request, res: Response) => {
  res.send('Acceso protegido');
});

export default router;
