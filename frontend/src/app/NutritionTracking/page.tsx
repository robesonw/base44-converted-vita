'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function NutritionTracking() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetch('/api/auth/me').then(res => res.json()),
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmitData = () => {
    // logic for data submission
    toast.success('Data recorded successfully!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nutrition Tracking</h1>
      <Button onClick={handleSubmitData}>Log Nutrition</Button>
    </div>
  );
}