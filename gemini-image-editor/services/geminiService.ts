import { GoogleGenAI, Modality } from "@google/genai";

// WARNING: It is strongly recommended to use environment variables for API keys.
// Hardcoding keys can be a security risk.
const API_KEY = "AIzaSyCkX-BToeBlQFqjIAkYmIB9ffEVWIm9q2M";

export const editImageWithGemini = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API_KEY is not set. Please add it to services/geminiService.ts");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Attempt to provide a more user-friendly error message
        if (error.message.includes('API_KEY') || error.message.includes('permission denied')) {
            throw new Error('Invalid or missing API Key. Please check the key in services/geminiService.ts.');
        }
        if (error.message.includes('429')) {
             throw new Error('API rate limit exceeded. Please try again later.');
        }
    }
    throw new Error("Failed to generate image due to an API error.");
  }
};