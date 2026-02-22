import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

const generateToken = (userId: string, email: string) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: { email, passwordHash: hashedPassword },
    });
    const token = generateToken(user.id, user.email);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: "User creation failed" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(user.id, user.email);
  res.json({ token, user });
});

router.get('/me', verifyToken, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }});
  res.json(user);
});

router.post('/logout', (req, res) => {
  res.sendStatus(200);
});

router.post('/refresh', verifyToken, (req, res) => {
  const token = generateToken(req.user.id, req.user.email);
  res.json({ token });
});

export default router;