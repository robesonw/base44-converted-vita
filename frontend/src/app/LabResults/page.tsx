'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function LabResults() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDate, setUploadDate] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);

  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetch('/api/auth/me').then(res => res.json()),
    retry: false,
  });

  // Fetch lab results
  const { data: labResults = [] } = useQuery({
    queryKey: ['labResults'],
    queryFn: () => fetch(`/api/LabResult?created_by=${user?.email}`).then(res => res.json()),
  });

  const createLabResult = useMutation({
    mutationFn: (data) => fetch('/api/LabResult', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labResults'] });
      toast.success('Lab result uploaded successfully!');
      setUploadDate('');
      setNotes('');
      setFile(null);
    },
  });

  const deleteLabResult = useMutation({
    mutationFn: (id) => fetch(`/api/LabResult/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labResults'] });
      toast.success('Lab result deleted successfully!');
    },
  });

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.name.toUpperCase().endsWith('.PDF') && !selectedFile.name.endsWith('.pdf')) {
      const newName = selectedFile.name.replace(/\.PDF$/i, '.pdf');
      const renamedFile = new File([selectedFile], newName, { type: 'application/pdf' });
      setFile(renamedFile);
    } else {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !uploadDate) {
      toast.error('Please select a file and date');
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await fetch('/api/ai/invoke', { method: 'POST', body: formData });
      const { file_url } = await uploadResponse.json();
      // Handle further processing with file_url
      const labResultData = { uploadDate, notes, file_url };
      await createLabResult.mutateAsync(labResultData);
    } catch (error) {
      toast.error('An error occurred during the upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Your UI for lab results goes here. E.g., form to upload lab results */}
      <form onSubmit={handleSubmit}>
        <Label htmlFor="uploadDate">Upload Date</Label>
        <Input id="uploadDate" type="date" value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} required />
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Input type="file" accept="application/pdf" onChange={handleFileUpload} required />
        <Button type="submit" disabled={isUploading}>Upload Lab Result</Button>
      </form>
      {/* Display existing lab results */}
      <div className="grid grid-cols-1 gap-4">{labResults.map((result) => (
        <Card key={result.id} className="border"> 
          <CardContent>{result.notes}</CardContent>
          <Button onClick={() => deleteLabResult.mutate(result.id)}>Delete</Button>
        </Card>
      ))}</div>
    </div>
  );
}