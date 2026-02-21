import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Analytics() {
  const { data: mealPlans = [] } = useQuery('mealPlans', () => axios.get('/api/mealplans').then(res => res.data));

  return (
    <div>
      <h1>Analytics</h1>
      {/* Render charts and analytics data here */}
    </div>
  );
}