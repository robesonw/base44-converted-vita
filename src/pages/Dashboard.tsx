import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: mealPlans = [] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mealPlans`).then(res => res.json()),
  });

  const stats = {
    activePlans: mealPlans.length,
    totalMeals: mealPlans.reduce((sum, p) => sum + (p.days?.length || 0) * 4, 0),
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Active Plans: {stats.activePlans}</p>
          <p>Total Meals Planned: {stats.totalMeals}</p>
        </CardContent>
      </Card>
    </div>
  );
}