import { GoogleGenAI } from '@google/genai';

/**
 * verifyAI - Client-side AI classification helper for EcoTrack Mobile
 * @param {string} base64Data - Raw base64 string of the image (without data:image/ prefix)
 * @returns {Promise<Object>} - The classification result
 */
export async function verifyAI(base64Data) {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_KEY;
    
    if (!apiKey) {
      console.error("❌ ERROR: VITE_GEMINI_KEY not found in environment.");
      throw new Error("Missing AI API Key");
    }

    const ai = new GoogleGenAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
You are a waste material expert. Use texture analysis. 
Plastic has specular highlights and reflections. Cardboard/Paper is matte and shows fiber grain. 
If you see matte texture with brown/white pulp, it is NOT plastic.

Classify this waste into exactly one of these categories: paper, plastic, cardboard.
Enforce Multi-Step Reasoning: Before returning the category, analyze and describe:
1. Surface Texture: Matte, Shiny, or Grainy?
2. Opacity: Transparent, Translucent, or Opaque?
3. Structural Clues: Edges, thickness, folds?

Output Format: Return the result strictly as a pure JSON object without markdown wrappers:
{ "category": "paper|plastic|cardboard", "confidence": "0.xx", "reasoning": "..." }
    `.trim();

    console.log("Attempting contact with gemini-3.1-flash-lite-preview...");
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      }
    ]);

    const response = await result.response;
    let ansText = response.text().trim();
    
    // Clean markdown wrappers
    ansText = ansText.replace(/^```(json)?/i, '').replace(/```$/i, '').trim();
    const data = JSON.parse(ansText);
    
    console.log("--- Extracted JSON output Schema ---");
    console.log(JSON.stringify(data, null, 2));

    return data;

  } catch (error) {
    console.error("AI Error Triggered:\n", error);
    throw error;
  }
}
