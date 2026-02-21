import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function AdminFeedback() {
  const [activeTab, setActiveTab] = useState('all');
  const queryClient = useQueryClient();

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks`).then(res => res.json()),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: {'Content-Type': 'application/json'},
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['feedbacks']);
      toast.success('Status updated');
    },
  });

  const stats = {
    total: feedbacks.length,
    new: feedbacks.filter(f => f.status === 'new').length,
    reviewed: feedbacks.filter(f => f.status === 'reviewed').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length,
    avgRating: feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.filter(f => f.rating).length).toFixed(1)
      : 0
  };

  const filteredFeedbacks = activeTab === 'all'
    ? feedbacks 
    : feedbacks.filter(f => f.status === activeTab);

  const getStatusBadge = (status) => {
    const config = {
      new: { label: 'New', className: 'bg-blue-100 text-blue-700' },
      reviewed: { label: 'Reviewed', className: 'bg-yellow-100 text-yellow-700' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700' }
    };
    const { label, className } = config[status] || config.new;
    return <Badge className={className}>{label}</Badge>;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading feedback...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Feedback Management</h1>
        <p className="text-slate-600 mt-1">Review and manage beta user feedback</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.new}</p>
                <p className="text-xs text-slate-500">New</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
                <p className="text-xs text-slate-500">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                <Bug className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.avgRating}</p>
                <p className="text-xs text-slate-500">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="py-4">
        {filteredFeedbacks.map(feedback => (
          <div key={feedback.id} className="border-b py-2 flex justify-between items-center">
            <div>
              <span>{feedback.comment}</span>
              <div>{getStatusBadge(feedback.status)}</div>
            </div>
            <Button onClick={() => updateStatusMutation.mutate({ id: feedback.id, status: feedback.status === 'new' ? 'reviewed' : 'resolved' })}>
              {feedback.status === 'new' ? 'Review' : 'Resolve'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}