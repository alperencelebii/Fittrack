import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper: safe JSON parsing
function safeParseJSON(text: string): any {
  try {
    // Remove markdown code block symbols if Gemini returned them
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("Failed to parse Gemini output as JSON. Raw output was:", text);
    throw new Error("Invalid JSON format from AI");
  }
}

// AI Training Program Generator Endpoint
app.post("/api/gemini/generate-program", async (req, res) => {
  try {
    const { goal, experience, frequency, split, userId } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }

    const prompt = `
      You are an expert personal trainer and AI fitness coach. Create a highly customized training program for an athlete with the following specifications:
      - Goal: ${goal}
      - Level/Experience: ${experience}
      - Workout frequency: ${frequency} days per week
      - Split type: ${split}

      You must return the training program strictly in the following JSON format. Do not write any explanations before or after the JSON.
      
      JSON Format:
      {
        "name": "Program Name (creative and customized in Turkish)",
        "goal": "Brief goal description in Turkish",
        "level": "Brief level description in Turkish",
        "weeklyDays": ${frequency},
        "durationWeeks": 8,
        "sessions": [
          {
            "dayNumber": 1,
            "name": "Session Name in Turkish (e.g. Göğüs & Ön Kol, Bacak Günü)",
            "exercises": [
              {
                "exerciseId": "matching_id_from_library (use standard camel_case or kebab-case)",
                "name": "Exercise Name in Turkish or standard English name widely used in Turkey",
                "sets": 3,
                "reps": "8-12",
                "rpe": 8,
                "restSeconds": 90,
                "order": 1,
                "notes": "Instruction / tip in Turkish"
              }
            ]
          }
        ]
      }

      Provide at least ${frequency} sessions, and each session must contain between 4 and 6 structured exercises. Keep the language of titles, notes and names in Turkish.
    `;

    console.log("Sending prompt to Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            goal: { type: Type.STRING },
            level: { type: Type.STRING },
            weeklyDays: { type: Type.INTEGER },
            durationWeeks: { type: Type.INTEGER },
            sessions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  name: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        exerciseId: { type: Type.STRING },
                        name: { type: Type.STRING },
                        sets: { type: Type.INTEGER },
                        reps: { type: Type.STRING },
                        rpe: { type: Type.INTEGER },
                        restSeconds: { type: Type.INTEGER },
                        order: { type: Type.INTEGER },
                        notes: { type: Type.STRING }
                      },
                      required: ["exerciseId", "name", "sets", "reps", "order"]
                    }
                  }
                },
                required: ["dayNumber", "name", "exercises"]
              }
            }
          },
          required: ["name", "goal", "level", "weeklyDays", "durationWeeks", "sessions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedProgram = safeParseJSON(text);
    res.json({ success: true, program: parsedProgram });
  } catch (error: any) {
    console.error("Gemini server-side error:", error);
    res.status(500).json({ success: false, error: error.message || "Unknown error occurred" });
  }
});

// Vite Middleware for Development / Static File Serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
