import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui/card';
import { toast } from 'sonner';

const Profile = () => {
  const [preferences, setPreferences] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/preferences`);
      const data = await response.json();
      setPreferences(data);
    };
    fetchPreferences();
  }, []);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    // Save preferences logic
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    if (response.ok) {
      toast.success('Preferences saved!');
    } else {
      toast.error('Failed to save preferences.');
    }
    setIsSaving(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Profile</h1>
      {preferences && (
        <Card className="mt-4">
          <h2 className="font-bold">Preferences</h2>
          <p>{JSON.stringify(preferences)}</p>
          <Button onClick={handleSavePreferences} disabled={isSaving} className="mt-2">{isSaving ? 'Saving...' : 'Save Preferences'}</Button>
        </Card>
      )}
    </div>
  );
};

export default Profile;