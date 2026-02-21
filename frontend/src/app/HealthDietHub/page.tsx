'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function HealthDietHub() {
  const [healthGoal, setHealthGoal] = useState('liver_health');

  const { data: healthOptions } = useQuery({
    queryKey: ['healthOptions'],
    queryFn: () => fetch('/api/healthOptions').then(res => res.json()),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Health Diet Hub</h1>
      <Select onValueChange={setHealthGoal}>
        {healthOptions?.map(option => (
          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </Select>
      <Button onClick={() => toast.success(`Selected ${healthGoal}`)}>Submit</Button>
    </div>
  );
}