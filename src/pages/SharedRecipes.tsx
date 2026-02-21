import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import SharedRecipeDetailDialog from '../components/community/SharedRecipeDetailDialog';
import SubmitRecipeDialog from '../components/community/SubmitRecipeDialog';

const fetchSharedRecipes = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sharedRecipes`);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
};

export default function SharedRecipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const queryClient = useQueryClient();

  const { data: sharedRecipes = [] } = useQuery(['sharedRecipes'], fetchSharedRecipes);

  const handleDetailOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setDetailDialogOpen(true);
  };

  const handleRecipeSubmit = async (recipe) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sharedRecipes`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(recipe),
    });
    if (!response.ok) throw new Error('Failed to submit recipe');
    await queryClient.invalidateQueries(['sharedRecipes']);
    toast.success('Recipe submitted successfully!');
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Shared Recipes</CardTitle>
          <Input
            placeholder="Search recipes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          {sharedRecipes.filter(recipe => recipe.name.includes(searchTerm)).map(recipe => (
            <div key={recipe.id} className="flex justify-between items-center border-b py-2">
              <span>{recipe.name}</span>
              <Button onClick={() => handleDetailOpen(recipe)}>View Details</Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <SharedRecipeDetailDialog open={detailDialogOpen} recipe={selectedRecipe} onOpenChange={setDetailDialogOpen} />
      <SubmitRecipeDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen} onSubmit={handleRecipeSubmit} />
    </div>
  );
}