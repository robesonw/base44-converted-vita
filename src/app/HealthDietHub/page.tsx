import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { useQuery } from 'react-query';

const healthGoals = [
  { value: 'liver_health', label: 'Liver Health' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'blood_sugar_control', label: 'Blood Sugar Control' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'heart_health', label: 'Heart Health' },
  { value: 'kidney_health', label: 'Kidney Health' },
  { value: 'digestive_health', label: 'Digestive Health' },
  { value: 'energy_boost', label: 'Energy Boost' },
  { value: 'immune_support', label: 'Immune Support' },
  { value: 'anti_inflammatory', label: 'Anti-Inflammatory' },
  { value: 'bone_health', label: 'Bone Health' },
  { value: 'general_wellness', label: 'General Wellness' },
];

const HealthDietHub = () => {
  const [healthGoal, setHealthGoal] = useState('liver_health');
  const [foodsLiked, setFoodsLiked] = useState('');
  const [foodsAvoided, setFoodsAvoided] = useState('');

  const fetchUserPreferences = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/preferences`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  };

  const { data: preferences } = useQuery('userPreferences', fetchUserPreferences);

  const handleGenerateMealPlan = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meal-plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ healthGoal, foodsLiked, foodsAvoided }),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Health Diet Hub</h1>
      <Card>
        <CardHeader>
          <CardTitle>Select Your Health Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose your goal" />
            </SelectTrigger>
            <SelectContent>
              {healthGoals.map(goal => (
                <SelectItem key={goal.value} value={goal.value} onClick={() => setHealthGoal(goal.value)}>{goal.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input onChange={(e) => setFoodsLiked(e.target.value)} placeholder="Foods you like" className="mt-4" />
          <Input onChange={(e) => setFoodsAvoided(e.target.value)} placeholder="Foods to avoid" className="mt-4" />
          <Button onClick={handleGenerateMealPlan} className="mt-4">Generate Meal Plan</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthDietHub;