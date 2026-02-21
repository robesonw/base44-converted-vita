import React, { useState } from 'react';
import { Accordion, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Implement search logic here
    console.log(searchQuery);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Help Center</h1>
      <Input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        placeholder="Search guides..." 
        className="mt-4"
      />
      <Button onClick={handleSearch} className="mt-2">Search</Button>
      <div className="mt-4">
        <Accordion>
          <AccordionTrigger>Getting Started</AccordionTrigger>
          <AccordionContent>
            <p>Guides for setting up your profile and using the app.</p>
          </AccordionContent>
          <AccordionTrigger>Meal Planning</AccordionTrigger>
          <AccordionContent>
            <p>Details on how to create and manage your meal plans.</p>
          </AccordionContent>
        </Accordion>
      </div>
    </div>
  );
};

export default HelpCenter;