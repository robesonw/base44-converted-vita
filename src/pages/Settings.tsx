import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bell } from 'lucide-react';

const fetchUser = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
  if (!response.ok) throw new Error('Failed to fetch user data');
  return response.json();
};

const updateUserSettings = async (data) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update user settings');
  return response.json();
};

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const { data: user, isLoading } = useQuery(['currentUser'], fetchUser);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    toast.success(`Dark mode ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleSave = async () => {
    const data = { full_name: user?.full_name, email: user?.email };
    await updateUserSettings(data);
    toast.success('Changes saved successfully!');
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account and application preferences</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl">{user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-sm text-slate-500 mt-2">JPG, GIF or PNG. Max size 2MB</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={user?.full_name} onChange={(e) => setUser({ ...user, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user?.email} disabled />
              </div>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}