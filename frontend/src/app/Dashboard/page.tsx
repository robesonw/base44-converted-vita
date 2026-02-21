'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Calendar, Flame, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickStartChecklist } from '../components/onboarding/QuickStartChecklist';
import { OnboardingTour } from '../components/onboarding/OnboardingTour';

export default function Dashboard() {
  const { data: mealPlans = [] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => fetch('/api/MealPlan').then(res => res.json()),
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetch('/api/auth/me').then(res => res.json()),
    retry: false,
  });

  const { data: sharedPlans = [] } = useQuery({
    queryKey: ['sharedPlans'],
    queryFn: () => fetch('/api/SharedMealPlan').then(res => res.json()),
  });

  const { data: labResults = [] } = useQuery({
    queryKey: ['labResults'],
    queryFn: () => fetch('/api/LabResult').then(res => res.json()),
  });

  const totalMeals = mealPlans.reduce((sum, p) => {
    return sum + (p.days?.length || 0) * 4;
  }, 0);

  const avgCalories = React.useMemo(() => {
    if (mealPlans.length === 0) return 0;
    let totalCals = 0;
    let dayCount = 0;
    mealPlans.forEach(plan => {
      plan.days?.forEach(day => {
        ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
          const meal = day[mealType];
          if (meal?.calories) {
            const match = meal.calories.match(/(\d+)/);
            if (match) {
              totalCals += parseInt(match[1]);
              dayCount++;
            }
          }
        });
      });
    });
    return dayCount > 0 ? Math.round(totalCals / (mealPlans.reduce((sum, p) => sum + (p.days?.length || 0), 0) || 1)) : 0;
  }, [mealPlans]);

  const stats = {
    activePlans: mealPlans.length,
    totalMeals,
    avgCalories,
    communityShares: sharedPlans.length,
  };

  const statCards = [
    { title: 'Active Plans', value: stats.activePlans, subtitle: 'meal plans', icon: Calendar },
    { title: 'Meals Planned', value: stats.totalMeals, subtitle: 'total meals', icon: Target },
    { title: 'Avg Calories/Day', value: stats.avgCalories > 0 ? `${stats.avgCalories}` : 'N/A', subtitle: stats.avgCalories > 0 ? 'kcal per day' : 'Create plans to track', icon: Flame },
    { title: 'Community Shares', value: stats.communityShares, subtitle: 'shared recently', icon: TrendingUp },
  ];

  const recentActivity = React.useMemo(() => {
    const activities = [];
    mealPlans.slice(0, 3).forEach(plan => {
      const date = new Date(plan.created_date);
      const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      const timeText = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
      activities.push({
        action: 'Created meal plan', plan: plan.name, time: timeText
      });
    });
    if (labResults.length > 0) {
      const date = new Date(labResults[0].upload_date);
      const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      const timeText = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
      activities.push({
        action: 'Uploaded lab results', plan: 'Health tracking', time: timeText
      });
    }  
    return activities.length > 0 ? activities.slice(0, 4) : [
      { action: 'Welcome!', plan: 'Start by creating your first meal plan', time: 'Get started' }
    ];
  }, [mealPlans, labResults]);

  return (
    <div className="space-y-6">
      <OnboardingTour />
      <QuickStartChecklist />
      <div className="flex items-center justify-between">
        {statCards.map((card, index) => (
          <Card key={index} className={`bg-${card.color}-500 text-white`}> 
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>{card.value}</CardContent>
          </Card>
        ))}
      </div>
    </div> 
  );
}