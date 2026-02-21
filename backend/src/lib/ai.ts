import fetch from 'node-fetch';

const AI_PROVIDER = process.env.AI_PROVIDER;
const AI_MODEL = process.env.AI_MODEL;
const AI_API_KEY = process.env.AI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;

export const invokeLLM = async ({ prompt, systemPrompt, jsonSchema, temperature = 1, maxTokens = 100 }) => {
  let response;
  switch (AI_PROVIDER) {
    case 'openai':
      response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature,
          max_tokens: maxTokens,
        }),
      });
      break;
    case 'anthropic':
      response = await fetch(`https://api.anthropic.com/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: AI_MODEL,
        }),
      });
      break;
    case 'gemini':
      response = await fetch(`https://generativelanguage.googleapis.com/v1alpha2/models/${AI_MODEL}:generateText`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          temperature,
          maxTokens,
        }),
      });
      break;
    case 'azure-openai':
      response = await fetch(`${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AI_MODEL}/completions?api-version=2023-05-15`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': AI_API_KEY,
        },
        body: JSON.stringify({
          prompt,
          temperature,
          max_tokens: maxTokens,
        }),
      });
      break;
    case 'ollama':
      response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          temperature,
          max_tokens: maxTokens,
        }),
      });
      break;
    default:
      throw new Error('Unsupported AI provider');
  }

  const data = await response.json();
  return jsonSchema ? data : data.choices[0].message.content;
};
