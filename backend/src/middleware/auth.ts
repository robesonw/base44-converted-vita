import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded as UserPayload;
    next();
  });
};

const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};

export { verifyToken, requireRole };