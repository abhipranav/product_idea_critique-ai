/**
 * API client for Flask backend
 */

const API_BASE = '/api';

export async function analyzeContent(text, mode, criteria = []) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content_text: text,
      analysis_mode: mode,
      criteria_data: criteria,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
