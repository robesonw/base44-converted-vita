'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function AdminRecipeModeration() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetch('/api/auth/me').then(res => res.json()),
  });
  
  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['allSharedRecipes'],
    queryFn: () => fetch('/api/sharedRecipes').then(res => res.json()),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }) => fetch(`/api/sharedRecipes/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status, moderation_notes: notes }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSharedRecipes'] });
      toast.success(`Recipe ${status}`);
      setSelectedRecipe(null);
      setModerationNotes('');
    },
  });

  if (user?.role !== 'admin') {
    return <div className="text-center py-12"><p className="text-slate-600">Access denied. Admin only.</p></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Recipe Moderation</h1>
      {/* Display Recipes List and Dialog */}
    </div>
  );
}