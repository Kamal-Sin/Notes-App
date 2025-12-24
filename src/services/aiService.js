/**
 * AI Service for Notes App
 * Handles AI-powered features like title generation and semantic search
 * Uses Google Gemini API
 */

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Generate a title from note content using Google Gemini
 * @param {string} text - The note content
 * @returns {Promise<string>} - Generated title
 */
export const generateTitle = async (text) => {
  if (!text || text.trim().length === 0) {
    return 'Untitled Note';
  }

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!apiKey) {
    return generateFallbackTitle(text);
  }

  try {
    // Truncate text if too long (Gemini has token limits)
    const truncatedText = text.length > 500 ? text.substring(0, 500) + '...' : text;
    
    const prompt = `Generate a short, descriptive title (max 50 characters) for this note. Return only the title, no additional text or explanation:\n\n${truncatedText}`;
    
    // Try different model names in order of preference (with models/ prefix)
    const models = ['models/gemini-flash-latest', 'models/gemini-pro-latest'];
    let lastError = null;
    
    for (const model of models) {
      try {
        const response = await fetch(`${API_BASE_URL}/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 20
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          lastError = new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
          continue; // Try next model
        }

        const data = await response.json();
        let title = null;
        
        // Try different response structures
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          title = data.candidates[0].content.parts[0].text.trim();
        } else if (data.text) {
          title = data.text.trim();
        }
        
        // If no title found, use fallback
        if (!title || title.length === 0) {
          title = generateFallbackTitle(text);
        }
        
        // Ensure title is not too long
        return title.length > 50 ? title.substring(0, 47) + '...' : title;
      } catch (modelError) {
        lastError = modelError;
        continue; // Try next model
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error('All model attempts failed');
  } catch (error) {
    console.error('Error generating title:', error);
    return generateFallbackTitle(text);
  }
};

/**
 * Generate embeddings for text using Google Gemini
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - Embedding vector
 */
export const generateEmbedding = async (text) => {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('Gemini API key not found. Semantic search will not work.');
    return null;
  }

  try {
    // Gemini embedding model has a limit, truncate if needed
    const combinedText = text.length > 8000 ? text.substring(0, 8000) : text;
    
    const response = await fetch(`${API_BASE_URL}/models/text-embedding-004:embedContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: {
          parts: [{
            text: combinedText
          }]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.embedding?.values || null;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
};

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vecA - First vector
 * @param {number[]} vecB - Second vector
 * @returns {number} - Similarity score (0-1)
 */
export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
};

/**
 * Fallback title generation when API is not available
 * @param {string} text - The note content
 * @returns {string} - Generated title
 */
const generateFallbackTitle = (text) => {
  // Remove extra whitespace and get first line or first 50 chars
  const cleaned = text.trim().replace(/\s+/g, ' ');
  const firstLine = cleaned.split('\n')[0];
  
  if (firstLine.length <= 50) {
    return firstLine || 'Untitled Note';
  }
  
  // Get first sentence or first 50 characters
  const firstSentence = firstLine.split(/[.!?]/)[0];
  if (firstSentence.length <= 50 && firstSentence.length > 0) {
    return firstSentence.trim();
  }
  
  return firstLine.substring(0, 47) + '...';
};
