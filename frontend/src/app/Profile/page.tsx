'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Profile() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetch('/api/auth/me').then(res => res.json()),
  });

  const handleSavePreferences = () => {
    // logic for saving user preferences
    toast.success('Preferences saved!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Button onClick={handleSavePreferences}>Save Preferences</Button>
    </div>
  );
}