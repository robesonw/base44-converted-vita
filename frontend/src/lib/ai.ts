const invokeAI = async ({ prompt, systemPrompt, jsonSchema }: { prompt: string, systemPrompt?: string, jsonSchema?: Object }): Promise<string | object> => {
  const response = await fetch('/api/ai/invoke', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ prompt, systemPrompt, jsonSchema }),
  });
  if (!response.ok) throw new Error('Error invoking AI');
  return response.json();
};

export { invokeAI };