'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function GroceryLists() {
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const queryClient = useQueryClient();

  const { data: mealPlans = [] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => fetch('/api/MealPlan').then(res => res.json()),
  });

  const selectedPlan = mealPlans.find(p => p.id === selectedPlanId);

  const updatePlanMutation = useMutation({
    mutationFn: (data) => fetch(`/api/MealPlan/${selectedPlanId}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
      toast.success('Grocery list updated');
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Grocery Lists</h1>
      {mealPlans.map(plan => (
        <Card key={plan.id} className="my-4">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setSelectedPlanId(plan.id)}>Edit</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}