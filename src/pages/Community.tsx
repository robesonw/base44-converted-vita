import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Community() {
  const { data: sharedPlans = [] } = useQuery({
    queryKey: ['sharedMealPlans'],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sharedMealPlans`).then(res => res.json()),
  });

  const { data: forumPosts = [] } = useQuery({
    queryKey: ['forumPosts'],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forumPosts`).then(res => res.json()),
  });

  const stats = [
    { label: 'Shared Plans', value: sharedPlans.length },
    { label: 'Forum Posts', value: forumPosts.length },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Community Hub</h1>
        <p className="text-lg">Connect, share, and learn from fellow nutrition enthusiasts</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="border-slate-200">
            <CardContent className="p-6">
              <p>{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}