import { Router } from 'express';
import { prisma } from '../prisma';
const router = Router();

// Get all recipes
router.get('/', async (req, res) => {
    const recipes = await prisma.recipe.findMany();
    res.json(recipes);
});

// Create a new recipe
router.post('/', async (req, res) => {
    const { name, instructions } = req.body;
    const recipe = await prisma.recipe.create({
        data: { name, instructions }
    });
    res.json(recipe);
});

// Update a recipe status
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const recipe = await prisma.recipe.update({
        where: { id: parseInt(id) },
        data: { status }
    });
    res.json(recipe);
});

export default router;