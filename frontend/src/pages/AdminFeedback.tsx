import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminFeedback() {
  const [activeTab, setActiveTab] = useState('all');
  const queryClient = useQueryClient();

  const { data: feedbacks = [], isLoading } = useQuery('feedbacks', () => axios.get('/api/feedbacks').then(res => res.data));

  const updateStatusMutation = useMutation(({ id, status }) => {
    return axios.patch(`/api/feedbacks/${id}`, { status });
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('feedbacks');
      toast.success('Status updated');
    }
  });

  if (isLoading) {
    return <div>Loading feedback...</div>;
  }

  return ( ... );
}