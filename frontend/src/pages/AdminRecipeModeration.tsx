import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminRecipeModeration() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const queryClient = useQueryClient();
  const { data: recipes = [], isLoading } = useQuery('recipes', () => axios.get('/api/recipes').then(res => res.data));

  const updateStatusMutation = useMutation(({ id, status, notes }) => {
    return axios.patch(`/api/recipes/${id}`, { status, moderation_notes: notes });
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('recipes');
      toast.success('Recipe status updated');
      setSelectedRecipe(null);
      setModerationNotes('');
    }
  });

  if (isLoading) {
    return <div>Loading recipes...</div>;
  }

  return ( ... );
}