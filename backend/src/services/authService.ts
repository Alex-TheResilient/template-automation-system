// backend/src/services/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';  // Cambia esta clave

// Función para autenticar al usuario
export const authenticateUser = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Comparar la contraseña con la contraseña encriptada
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta');
  }

  // Crear un token JWT si la contraseña es válida
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

// Función para crear el usuario admin
export const createAdminUser = async () => {
  const username = 'admin';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      console.log('El usuario admin ya existe.');
      return;
    }

    // Crear el usuario admin con todos los campos obligatorios
    const adminUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        firstName: 'admin',  // Puedes colocar un nombre por defecto
        lastName: 'admin',    // Puedes colocar un apellido por defecto
      },
    });

    console.log('Usuario admin creado exitosamente:', adminUser);
  } catch (error) {
    console.error('Error al crear el usuario admin:', error);
  }
};
