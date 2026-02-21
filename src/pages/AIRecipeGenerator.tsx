import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const cuisineTypes = [
  'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'Mediterranean',
  'French', 'American', 'Korean', 'Vietnamese', 'Middle Eastern', 'Greek', 'Spanish', 'Other'
];

const dietaryPreferences = [
  'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 
  'Paleo', 'Low-Carb', 'High-Protein', 'Pescatarian', 'Halal', 'Kosher'
];

const difficultyLevels = ['Easy', 'Medium', 'Hard'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

export default function AIRecipeGenerator() {
  const [generating, setGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    recipeName: '',
    mealType: 'Dinner',
    cuisine: 'Italian',
    customCuisine: '',
    dietary: 'None',
    difficulty: 'Medium',
    ingredients: '',
    servings: 4,
    cookTime: 30,
    additionalNotes: ''
  });

  const handleGenerate = async () => {
    if (!form.ingredients.trim()) {
      toast.error('Please enter some available ingredients');
      return;
    }
    setGenerating(true);
    try {
      const cuisineName = form.cuisine === 'Other' ? form.customCuisine : form.cuisine;
      const prompt = `Generate a detailed ${form.difficulty.toLowerCase()} difficulty ${cuisineName} ${form.mealType.toLowerCase()} recipe.\n\n${form.recipeName ? `Recipe Name: ${form.recipeName}` : 'Create a creative recipe name'}\nDietary Preference: ${form.dietary}\nAvailable Ingredients: ${form.ingredients}\nServings: ${form.servings}\nTarget Cook Time: ~${form.cookTime} minutes\n${form.additionalNotes ? `Additional Notes: ${form.additionalNotes}` : ''}\n\nProvide:\n1. Recipe name${form.recipeName ? ' (use the provided name or a slight variation if needed for accuracy)' : ''}\n2. Complete ingredient list with quantities\n3. Step-by-step instructions\n4. Nutritional information per serving (calories, protein, carbs, fat)\n5. Prep time and cook time\n6. Chef's tips or variations\n7. Health benefits`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/generate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ prompt })
      });
      const recipe = await response.json();
      setGeneratedRecipe(recipe);
      toast.success('Recipe generated successfully!');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
    setGenerating(false);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>AI Recipe Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Recipe Name</Label>
          <Input 
            value={form.recipeName}
            onChange={(e) => setForm({ ...form, recipeName: e.target.value })}
          />
          <Label>Meal Type</Label>
          <Select value={form.mealType} onValueChange={(value) => setForm({ ...form, mealType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Meal Type" />
            </SelectTrigger>
            <SelectContent>
              {mealTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
            </SelectContent>
          </Select>
          <Label>Cuisine</Label>
          <Select value={form.cuisine} onValueChange={(value) => setForm({ ...form, cuisine: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Cuisine" />
            </SelectTrigger>
            <SelectContent>
              {cuisineTypes.map((cuisine) => (<SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>))}
            </SelectContent>
          </Select>
          <Label>Available Ingredients</Label>
          <Textarea value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
          <Button onClick={handleGenerate} disabled={generating}>{generating ? 'Generating...' : 'Generate Recipe'}</Button>
          {generatedRecipe && <div>{JSON.stringify(generatedRecipe)}</div>}
        </CardContent>
      </Card>
    </div>
  );
}