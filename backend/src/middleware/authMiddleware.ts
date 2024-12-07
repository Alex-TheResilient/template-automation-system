// backend/src/middleware/authMiddleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthenticatedRequest extends Request {
  user?: string | object;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];  // Token esperado en el formato "Bearer <token>"

  if (!token) {
    res.status(403).json({ message: 'Token no proporcionado' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Token inválido' });
      return;
    }

    req.user = user;
    next(); // Si el token es válido, se pasa al siguiente middleware
  });
};
