const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

// NOTE: In production/mobile environments, use environment variables directly
// instead of reading .env files with fs.
const apiKey = process.env.GEMINI_API_KEY;

async function verifyAI() {
  try {
    if (!apiKey) {
      console.error("❌ ERROR: GEMINI_API_KEY not found in process.env");
      return;
    }

    const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1' } });
    
    // Dynamic asset pathing for test images
    // For local testing, ensure 'test-image.jpg' is in the same directory as this script.
    const imagePath = path.join(__dirname, 'test-image.jpg');
    
    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠️  Warning: Test image not found at ${imagePath}. Please ensure an image exists for AI verification.`);
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

    console.log("Attempting contact with gemini-3.1-flash-lite-preview...");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
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
    ansText = ansText.replace(/^```(json)?/i, '').replace(/```$/i, '').trim();
    const data = JSON.parse(ansText);
    
    console.log("--- Extracted JSON output Schema ---");
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error("AI Error Triggered:\n", error);
  }
}

// Check if running directly
if (require.main === module) {
  verifyAI();
}

module.exports = { verifyAI };
