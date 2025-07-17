import { GoogleGenAI, Type } from "@google/genai";

// This check is for robustness, assuming process.env.API_KEY is configured externally.
if (!process.env.API_KEY) {
  // In a real application, you might want to handle this more gracefully.
  // For this context, we assume the key is always present.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Defines the expected JSON structure for the AI's response.
const colorDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        munsell: {
            type: Type.STRING,
            description: 'The approximate Munsell notation for the color (e.g., "5PB 3/12").'
        },
        pccs: {
            type: Type.STRING,
            description: 'The approximate PCCS tone for the color (e.g., "v22" or "vivid blue").'
        }
    },
    required: ['munsell', 'pccs']
};

export interface ColorDetails {
    munsell: string;
    pccs: string;
}

/**
 * Fetches extended color details (Munsell, PCCS) from the Gemini API.
 * @param colorName The traditional Japanese name of the color.
 * @param hexCode The hex code of the color.
 * @returns A promise that resolves to an object with munsell and pccs values.
 */
export async function getExtendedColorDetails(colorName: string, hexCode: string): Promise<ColorDetails> {
    const prompt = `日本の伝統色「${colorName}」（16進数カラーコード: ${hexCode}）について、近似のマンセル値とPCCSトーンを教えてください。`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: colorDetailsSchema
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Basic validation to ensure the response matches our expected structure.
        if (typeof parsedJson.munsell === 'string' && typeof parsedJson.pccs === 'string') {
            return parsedJson as ColorDetails;
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }

    } catch (error) {
        console.error(`Error fetching color details for ${colorName}:`, error);
        // Re-throw the error to be handled by the calling component.
        throw new Error("Failed to generate color details from the API.");
    }
}
