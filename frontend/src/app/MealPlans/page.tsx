'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function MealPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const queryClient = useQueryClient();

  const { data: mealPlans = [], isLoading } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => fetch('/api/MealPlan').then(res => res.json()),
  });

  const deletePlanMutation = useMutation({
    mutationFn: (planId) => fetch(`/api/MealPlan/${planId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
      toast.success('Meal plan deleted');
    },
  });

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    // Logic to view plan details 
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meal Plans & Favorites</h1>
        <p>View your saved meal plans and favorite meals</p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {mealPlans.length === 0 ? (
            <Card className="border-slate-200 border-dashed">
              <CardContent className="p-12 text-center">
                <h3>No Meal Plans Yet</h3>
                <p>Create your first meal plan in the Health Diet Hub</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mealPlans.map((plan) => (
                <Card key={plan.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{plan.name}</CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge>{plan.diet_type}</Badge>
                          <Badge>{plan.days?.length || 0} days</Badge>
                        </div>
                      </div>
                      <Button onClick={() => handleViewPlan(plan)}>View</Button>
                      <Button onClick={() => deletePlanMutation.mutate(plan.id)}>Delete</Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}