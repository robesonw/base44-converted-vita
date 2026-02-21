import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/dialog';

const FeedbackButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const { data: user } = useQuery('currentUser', () => base44.auth.me(), { retry: false });

  const handleSubmit = async () => {
    try {
      await base44.entities.Feedback.create({ userId: user.id, message: feedback });
      toast.success('Feedback submitted!');
      setOpen(false);
    } catch (error) {
      toast.error('Error submitting feedback.');
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Feedback</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Your feedback here..." />
        <Button onClick={handleSubmit}>Submit</Button>
      </Dialog>
    </div>
  );
};

export default FeedbackButton;