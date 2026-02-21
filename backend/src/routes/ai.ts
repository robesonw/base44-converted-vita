import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { invokeLLM } from '../lib/ai';

const router = Router();

router.post('/invoke', verifyToken, async (req, res) => {
  const { prompt, systemPrompt, jsonSchema } = req.body;
  try {
    const result = await invokeLLM({ prompt, systemPrompt, jsonSchema });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error invoking AI', error: error.message });
  }
});

export default router;