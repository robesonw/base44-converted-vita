import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SharedPlanDetailDialog from '../components/community/SharedPlanDetailDialog';

const fetchSharedPlans = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sharedMealPlans`);
  if (!response.ok) throw new Error('Failed to fetch meal plans');
  return response.json();
};

export default function SharedMealPlans() {
  const [searchTerm, setSearchTerm] = useState('');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPlanDetail, setSelectedPlanDetail] = useState(null);
  const queryClient = useQueryClient();

  const { data: sharedPlans = [] } = useQuery(['sharedMealPlans'], fetchSharedPlans);

  const handleDetailOpen = (plan) => {
    setSelectedPlanDetail(plan);
    setDetailDialogOpen(true);
  }; 

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Shared Meal Plans</CardTitle>
          <Input
            placeholder="Search steps"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          {sharedPlans.filter(plan => plan.title.includes(searchTerm)).map(plan => (
            <div key={plan.id} className="flex justify-between items-center border-b py-2">
              <span>{plan.title}</span>
              <Button onClick={() => handleDetailOpen(plan)}>View Details</Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <SharedPlanDetailDialog open={detailDialogOpen} plan={selectedPlanDetail} onOpenChange={setDetailDialogOpen} />
    </div>
  );
}