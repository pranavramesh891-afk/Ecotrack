const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function verifyAI() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not found in .env");
    }

    const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1' } });
    
    // Using path.join for the test image to avoid hardcoded paths
    const imagePath = path.join(__dirname, 'test-image.jpg');
    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠️  Test image not found at: ${imagePath}`);
      return;
    }
    const rawBase64 = fs.readFileSync(imagePath, {encoding: 'base64'});

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

    console.log("Attempting contact with gemini-3.1-flash...");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash',
      contents: [
        prompt,
        {
          inlineData: {
            data: rawBase64,
            mimeType: 'image/jpeg'
          }
        }
      ]
    });
    
    console.log("\n✅ AI CONNECTION SUCCESSFUL");
    let ansText = response.text.trim();
    // Re-verify the regex parser works live
    ansText = ansText.replace(/^```(json)?/i, '').replace(/```$/i, '').trim();
    const data = JSON.parse(ansText);
    
    console.log("--- Extracted JSON output Schema ---");
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error("AI Error Triggered:\n", error);
  }
}
verifyAI();
