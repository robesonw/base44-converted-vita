import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminRecipeModeration() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['allSharedRecipes'],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`).then(res => res.json()),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }) => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, moderation_notes: notes }),
        headers: {'Content-Type': 'application/json'},
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['allSharedRecipes']);
      toast.success(`Recipe ${variables.status}`);
      setSelectedRecipe(null);
      setModerationNotes('');
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading recipes...</div>;
  }

  const RecipeCard = ({ recipe }) => (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img src={recipe.image_url} alt={recipe.name} className="w-24 h-24 object-cover rounded-lg" />
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{recipe.name}</h3>
            <p className="text-xs text-slate-500">by {recipe.author_name}</p>
            <Button onClick={() => setSelectedRecipe(recipe)}>Moderate</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Moderate Recipes</h1>
      <div className="grid grid-cols-1 gap-4">{recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate {selectedRecipe?.name}</DialogTitle>
          </DialogHeader>
          <textarea value={moderationNotes} onChange={(e) => setModerationNotes(e.target.value)} />
          <Button onClick={() => updateStatusMutation.mutate({ id: selectedRecipe.id, status: 'approved', notes: moderationNotes })}>Approve</Button>
          <Button onClick={() => updateStatusMutation.mutate({ id: selectedRecipe.id, status: 'rejected', notes: moderationNotes })}>Reject</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}