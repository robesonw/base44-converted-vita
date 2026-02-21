import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(bodyParser.json());
const upload = multer({ dest: process.env.FILE_STORAGE_PATH });

// JWT Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// CRUD endpoints for User
app.post('/users', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.create({ data: { email, password }});
    res.json(user);
});

app.get('/users/:id', async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) }});
    res.json(user);
});

app.put('/users/:id', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { email, password }});
    res.json(user);
});

app.delete('/users/:id', async (req, res) => {
    await prisma.user.delete({ where: { id: Number(req.params.id) }});
    res.sendStatus(204);
});

// Auth endpoints
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }});
    if (user && user.password === password) {
        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.sendStatus(401);
    }
});

app.post('/logout', authenticateJWT, (req, res) => {
    // Perform token invalidation if needed
    res.sendStatus(204);
});

app.get('/me', authenticateJWT, (req, res) => {
    res.json(req.user);
});

// File upload endpoint
app.post('/upload', authenticateJWT, upload.single('file'), async (req, res) => {
    const file = await prisma.file.create({ data: { path: req.file.path, userId: req.user.id }});
    res.json(file);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});