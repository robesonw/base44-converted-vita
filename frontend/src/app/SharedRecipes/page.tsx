'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function SharedRecipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetch('/api/auth/me').then(res => res.json()),
  });

  const { data: allSharedRecipes = [] } = useQuery({
    queryKey: ['sharedRecipes'],
    queryFn: () => fetch('/api/SharedRecipe').then(res => res.json()),
  });

  const handleLike = (recipeId, authorEmail) => {
    fetch('/api/UserInteraction', {
      method: 'POST',
      body: JSON.stringify({
        target_id: recipeId,
        target_type: 'shared_recipe',
        interaction_type: 'like',
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then(() => {
      toast.success('Liked!');
      if (authorEmail && authorEmail !== user?.email) {
        fetch('/api/Notification', {
          method: 'POST',
          body: JSON.stringify({
            recipient_email: authorEmail,
            type: 'recipe_like',
            title: 'Recipe Liked',
            message: `${user?.full_name || 'Someone'} liked your recipe`,
            actor_name: user?.full_name || 'Anonymous',
          }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Shared Recipes</h1>
      <Input placeholder="Search recipes" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <div>
        {allSharedRecipes.map(recipe => (
          <Card key={recipe.id} className="mb-4">
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
              <Button onClick={() => handleLike(recipe.id, recipe.created_by)}>Like</Button>
            </CardHeader>
            <CardContent>
              <p>{recipe.description}</p>
              <Badge>{recipe.meal_type}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}