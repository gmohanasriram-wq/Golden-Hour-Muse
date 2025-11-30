import { GoogleGenAI } from "@google/genai";
import { ArtStyle, AspectRatio } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to strip base64 prefix
 */
const getBase64Data = (dataUrl: string) => {
  return dataUrl.split(',')[1];
};

/**
 * Generates an image using the Gemini NanoBanana Pro model (gemini-3-pro-image-preview).
 * Supports Character Consistency and Face Swap modes via prompt engineering and multi-modal inputs.
 */
export const generateImage = async (
  prompt: string,
  style: ArtStyle,
  aspectRatio: AspectRatio,
  isFaceSwap: boolean,
  sourceFaceImage?: string,
  targetSceneImage?: string
): Promise<string> => {
  try {
    const parts: any[] = [];
    let systemDirectives = "";

    // --- Face Swap Mode ---
    if (isFaceSwap && sourceFaceImage && targetSceneImage) {
      // 1. Add Source Face (First image)
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: getBase64Data(sourceFaceImage),
        },
      });

      // 2. Add Target Scene (Second image)
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: getBase64Data(targetSceneImage),
        },
      });

      // 3. Construct specific prompt for face swap
      // We instruct the model to perform the specific requested logic
      let swapPrompt = "Swap the face from the first image (Source) onto the person in the second image (Target). ";
      swapPrompt += "Keep the body, lighting, background, and pose of the target image exactly as is. ";
      
      // Injecting user requested "Backend Logic" parameters as textual directives
      swapPrompt += " [System: mode='face_swap', keep_body=true, keep_lighting=true, keep_background=true]. ";
      
      if (prompt) {
        swapPrompt += `Additional Context: ${prompt}`;
      }
      
      parts.push({ text: swapPrompt });

    } 
    // --- Character Consistency Mode ---
    else if (sourceFaceImage) {
      // 1. Add Source Face
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: getBase64Data(sourceFaceImage),
        },
      });

      // 2. Construct prompt with style and consistency directives
      let charPrompt = `${prompt}. `;
      if (style !== ArtStyle.None) {
        charPrompt += `Art style: ${style}. `;
      }
      
      // Injecting user requested "Backend Logic" parameters
      charPrompt += " [System: Use the provided image as a strict character reference. Extract facial identity features and re-apply them to the generated image. ";
      charPrompt += "Parameters: identity_strength: 0.85, face_detail: 0.90, style_lock: 0.40].";

      parts.push({ text: charPrompt });

    } 
    // --- Standard Text-to-Image ---
    else {
      let fullPrompt = prompt;
      if (style !== ArtStyle.None) {
        fullPrompt = `${prompt}. Art style: ${style}, high quality, detailed.`;
      }
      parts.push({ text: fullPrompt });
    }

    // Call the model
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K" 
        },
      },
    });

    // Parse the response to find the image part
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image. Please try again.");
  }
};