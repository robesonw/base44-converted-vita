'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function SharedMealPlans() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPlanForShare, setSelectedPlanForShare] = useState(null);
  const [shareForm, setShareForm] = useState({ title: '', description: '', tags: '' });
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetch('/api/auth/me').then(res => res.json()),
  });

  const { data: sharedPlans = [] } = useQuery({
    queryKey: ['sharedMealPlans'],
    queryFn: () => fetch('/api/SharedMealPlan').then(res => res.json()),
  });

  const sharePlanMutation = useMutation({
    mutationFn: (data) => fetch('/api/SharedMealPlan', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharedMealPlans'] });
      toast.success('Meal plan shared with the community!');
      setShareDialogOpen(false);
      setShareForm({ title: '', description: '', tags: '' });
    },
  });

  const handleShare = () => {
    if (!selectedPlanForShare || !shareForm.title) {
      toast.error('Please fill in required fields');
      return;
    }

    sharePlanMutation.mutate({
      original_plan_id: selectedPlanForShare.id,
      title: shareForm.title,
      description: shareForm.description,
      plan_data: selectedPlanForShare,
      diet_type: selectedPlanForShare.diet_type,
      cultural_style: selectedPlanForShare.cultural_style,
      tags: shareForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      author_name: user?.full_name || 'Anonymous',
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Shared Meal Plans</h1>
      <Button onClick={() => setShareDialogOpen(true)}>Share a Meal Plan</Button>
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Meal Plan</DialogTitle>
          </DialogHeader>
          <Textarea value={shareForm.description} onChange={(e) => setShareForm({ ...shareForm, description: e.target.value })} placeholder="Description" />
          <Button onClick={handleShare}>Share</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}