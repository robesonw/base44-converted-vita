'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Analytics() {
  const { data: mealPlans = [] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => fetch('/api/mealPlans').then(res => res.json()),
  });

  // Perform analytics calculations here

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Meal Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Display charts and data */}
        </CardContent>
      </Card>
    </div>
  );
}