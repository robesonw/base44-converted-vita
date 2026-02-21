'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageSquare, TrendingUp, Trophy, Target, Flame } from 'lucide-react';
import { toast } from 'sonner';
import NutritionLeaderboard from '../components/leaderboard/NutritionLeaderboard';
import { format } from 'date-fns';

export default function ProgressFeed() {
  const [commentText, setCommentText] = useState({});
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetch('/api/auth/me').then(res => res.json()),
  });

  const { data: sharedProgress = [] } = useQuery({
    queryKey: ['sharedProgress'],
    queryFn: () => fetch('/api/SharedProgress').then(res => res.json()),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['progressComments'],
    queryFn: () => fetch('/api/ProgressComment').then(res => res.json()),
  });

  const { data: interactions = [] } = useQuery({
    queryKey: ['progressInteractions'],
    queryFn: () => fetch('/api/UserInteraction').then(res => res.json()),
  });

  const likeProgressMutation = useMutation({
    mutationFn: async (progressId) => {
      const existing = interactions.find(
        i => i.target_id === progressId && i.created_by === user?.email && i.interaction_type === 'like'
      );

      if (existing) {
        await fetch(`/api/UserInteraction/${existing.id}`, { method: 'DELETE' });
        await fetch(`/api/SharedProgress/${progressId}`, {
          method: 'PATCH',
          body: JSON.stringify({ likes_count: Math.max(0, (sharedProgress.find(p => p.id === progressId)?.likes_count || 0) - 1) }),
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        await fetch('/api/UserInteraction', {
          method: 'POST',
          body: JSON.stringify({
            target_id: progressId,
            target_type: 'shared_progress',
            interaction_type: 'like'
          }),
          headers: { 'Content-Type': 'application/json' }
        });
        await fetch(`/api/SharedProgress/${progressId}`, {
          method: 'PATCH',
          body: JSON.stringify({ likes_count: (sharedProgress.find(p => p.id === progressId)?.likes_count || 0) + 1 }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharedProgress'] });
      queryClient.invalidateQueries({ queryKey: ['progressInteractions'] });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ progressId, comment }) => fetch('/api/ProgressComment', {
      method: 'POST',
      body: JSON.stringify({
        progress_id: progressId,
        comment,
        author_name: user?.full_name || 'Anonymous'
      }),
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progressComments'] });
      const progress = sharedProgress.find(p => p.id === variables.progressId);
      fetch(`/api/SharedProgress/${variables.progressId}`, {
        method: 'PATCH',
        body: JSON.stringify({ comments_count: (progress?.comments_count || 0) + 1 }),
        headers: { 'Content-Type': 'application/json' }
      });
      queryClient.invalidateQueries({ queryKey: ['sharedProgress'] });
      setCommentText(prev => ({ ...prev, [variables.progressId]: '' }));
      toast.success('Comment added!');
    },
  });

  const hasLiked = (progressId) => {
    return interactions.some(
      i => i.target_id === progressId && i.created_by === user?.email && i.interaction_type === 'like'
    );
  };

  const getProgressComments = (progressId) => {
    return comments.filter(c => c.progress_id === progressId);
  };

  const getProgressIcon = (type) => {
    switch(type) {
      case 'streak': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'goal_reached': return <Target className="w-5 h-5 text-green-500" />;
      case 'milestone': return <Trophy className="w-5 h-5 text-amber-500" />;
      default: return <TrendingUp className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Progress Feed</h1>
        <p className="text-slate-600 mt-1">See what the community is achieving</p>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {sharedProgress.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No shared progress yet</h3>
                <p className="text-slate-600">Be the first to share your nutrition tracking progress!</p>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
