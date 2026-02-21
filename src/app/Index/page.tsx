import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen p-6 flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-6">Welcome to VitaPlate</h1>
      <div className="flex space-x-4">
        <Button asChild className="bg-blue-500 text-white">
          <Link to="/HealthDietHub">Get Started</Link>
        </Button>
        <Button asChild className="bg-gray-300 text-gray-800">
          <Link to="/Dashboard">View Dashboard</Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {['AI Recipe Generator', 'Nutrition Tracking', 'Smart Meal Plans'].map((feature, index) => (
          <Card key={index} className="p-4 text-center">
            <h2 className="text-xl font-semibold">{feature}</h2>
            <p className="text-gray-500">Description for {feature}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;