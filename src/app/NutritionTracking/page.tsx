import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui/card';
import { toast } from 'sonner';

const NutritionTracking = () => {
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({ meal: '', calories: 0, date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    const fetchNutritionLogs = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nutrition-logs`);
      const data = await response.json();
      setLogs(data);
    };
    fetchNutritionLogs();
  }, []);

  const handleAddLog = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nutrition-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog),
    });
    if (response.ok) {
      toast.success('Nutrition log added!');
      setNewLog({ meal: '', calories: 0, date: '' });
      const addedLog = await response.json();
      setLogs((prev) => [...prev, addedLog]);
    } else {
      toast.error('Failed to add log.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Nutrition Tracking</h1>
      <form onSubmit={handleAddLog} className="flex flex-col mt-4">
        <input type="text" placeholder="Meal" className="border mb-2" value={newLog.meal} onChange={(e) => setNewLog({ ...newLog, meal: e.target.value })} required />
        <input type="number" placeholder="Calories" className="border mb-2" value={newLog.calories} onChange={(e) => setNewLog({ ...newLog, calories: e.target.value })} required />
        <Button type="submit">Add Log</Button>
      </form>
      <div className="mt-4">
        {logs.map(log => (
          <Card key={log.id} className="mt-2 p-4">
            <h2 className="font-bold">{log.meal} - {log.calories} calories</h2>
            <p>{new Date(log.date).toLocaleDateString()}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NutritionTracking;