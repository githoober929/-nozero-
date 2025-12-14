import { GoogleGenAI, Type } from "@google/genai";
import { MOTIVATION_PROMPT, REFLECTION_PROMPT_TEMPLATE } from '../constants';
import { MotivationResponse, MotivationType, MonthlyStats } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchMotivation = async (): Promise<MotivationResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: MOTIVATION_PROMPT,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            type: { 
              type: Type.STRING, 
              enum: [MotivationType.QUOTE, MotivationType.TASK] 
            }
          },
          required: ["text", "type"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }

    const data = JSON.parse(jsonText) as MotivationResponse;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "One small step is better than no steps.",
      type: MotivationType.QUOTE
    };
  }
};

export const generateMonthlyReflection = async (stats: MonthlyStats): Promise<string> => {
  const prompt = REFLECTION_PROMPT_TEMPLATE
    .replace('{{totalDays}}', stats.totalDays.toString())
    .replace('{{category}}', stats.mostCommonCategory)
    .replace('{{lowEffort}}', stats.lowEffortCount.toString())
    .replace('{{hardestDay}}', stats.hardestDayNote || "a quiet day");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Keep going. Every day counts.";
  } catch (error) {
    console.error("Gemini Reflection Error:", error);
    return "Consistency is the quiet language of growth. You've done well this month.";
  }
};
