import { GoogleGenAI, Type } from "@google/genai";
import { Slide, SlideTheme, SlideLayout } from "../types";

// Initialize Gemini Client
// Note: API_KEY must be set in Vercel Environment Variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSlidesFromTopic = async (topic: string): Promise<Partial<Slide>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 3 distinct digital signage slides for a campaign about: "${topic}".
      Each slide should have a catchy title, a short persuasive description (content), and a keyword to search for a background image.
      Vary the themes and layouts.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              imageKeyword: { type: Type.STRING, description: "A single keyword to search for an image (e.g., 'coffee', 'beach')" },
              theme: { type: Type.STRING, enum: ["dark", "light", "blue", "red", "green"] },
              layout: { type: Type.STRING, enum: ["center", "split-left", "split-right", "image-only"] }
            },
            required: ["title", "content", "imageKeyword", "theme", "layout"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Map the AI response to our Slide structure, adding generic images based on keywords
    return data.map((item: any) => ({
      title: item.title,
      content: item.content,
      backgroundImage: `https://source.unsplash.com/1600x900/?${encodeURIComponent(item.imageKeyword)}`,
      // Fallback to picsum if unsplash source is deprecated or slow in some regions, but keeping logic simple for now:
      // In a real app, we might use a specific image API. Let's use picsum with a hash to ensure variety if needed, 
      // but Unsplash source is standard for these demos. 
      // Actually, standard Unsplash source URL often redirects. Let's use Picsum with a seed for stability.
      // Modifying to use Picsum for reliability in demo code.
      // backgroundImage: `https://picsum.photos/seed/${item.imageKeyword + Math.random()}/1920/1080`,
      theme: item.theme as SlideTheme,
      layout: item.layout as SlideLayout,
      duration: 10
    }));

  } catch (error) {
    console.error("Failed to generate slides:", error);
    throw error;
  }
};
