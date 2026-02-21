import React, { useState, useEffect } from 'react';
import { Card, Button } from '@/components/ui/card';
import { toast } from 'sonner';

const MealPlans = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchMealPlans = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meal-plans`);
      const data = await response.json();
      setMealPlans(data);
    };
    fetchMealPlans();
  }, []);

  const deletePlan = async (planId) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meal-plans/${planId}`, { method: 'DELETE' });
    setMealPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
    toast.success('Meal plan deleted');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Meal Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {mealPlans.length === 0 ? (
          <Card className="border-dashed p-4 text-center">
            <p>No Meal Plans Yet. Create one from the Health Diet Hub.</p>
          </Card>
        ) : (
          mealPlans.map(plan => (
            <Card key={plan.id} className="p-4">
              <h2 className="font-bold">{plan.title}</h2>
              <Button onClick={() => deletePlan(plan.id)} className="mt-2">Delete</Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MealPlans;