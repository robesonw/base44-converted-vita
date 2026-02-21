import React, { useEffect, useState } from 'react';
import { Button, Card, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const LabResults = () => {
  const [uploadDate, setUploadDate] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [labResults, setLabResults] = useState([]);

  useEffect(() => {
    const fetchLabResults = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lab-results`);
      const data = await response.json();
      setLabResults(data);
    };
    fetchLabResults();
  }, []);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !uploadDate) {
      toast.error('Please select a file and date');
      return;
    }

    // Upload logic here
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadDate', uploadDate);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lab-results`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      toast.success('Lab result uploaded successfully!');
      setUploadDate('');
      setNotes('');
      setFile(null);
      // Refresh lab results
    } else {
      toast.error('Error uploading lab result');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Lab Results</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <Input type="date" value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} className="mb-2" />
        <Input type="file" onChange={handleFileUpload} className="mb-2" />
        <Button type="submit">Upload Result</Button>
      </form>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Uploaded Lab Results</h2>
        {labResults.map(result => (
          <Card key={result.id} className="mt-2">
            <CardContent>
              <CardTitle>{result.upload_date}</CardTitle>
              <p>{result.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LabResults;