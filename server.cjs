var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
function safeParseJSON(text) {
  try {
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("Failed to parse Gemini output as JSON. Raw output was:", text);
    throw new Error("Invalid JSON format from AI");
  }
}
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
            "name": "Session Name in Turkish (e.g. G\xF6\u011F\xFCs & \xD6n Kol, Bacak G\xFCn\xFC)",
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
          type: import_genai.Type.OBJECT,
          properties: {
            name: { type: import_genai.Type.STRING },
            goal: { type: import_genai.Type.STRING },
            level: { type: import_genai.Type.STRING },
            weeklyDays: { type: import_genai.Type.INTEGER },
            durationWeeks: { type: import_genai.Type.INTEGER },
            sessions: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  dayNumber: { type: import_genai.Type.INTEGER },
                  name: { type: import_genai.Type.STRING },
                  exercises: {
                    type: import_genai.Type.ARRAY,
                    items: {
                      type: import_genai.Type.OBJECT,
                      properties: {
                        exerciseId: { type: import_genai.Type.STRING },
                        name: { type: import_genai.Type.STRING },
                        sets: { type: import_genai.Type.INTEGER },
                        reps: { type: import_genai.Type.STRING },
                        rpe: { type: import_genai.Type.INTEGER },
                        restSeconds: { type: import_genai.Type.INTEGER },
                        order: { type: import_genai.Type.INTEGER },
                        notes: { type: import_genai.Type.STRING }
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
  } catch (error) {
    console.error("Gemini server-side error:", error);
    res.status(500).json({ success: false, error: error.message || "Unknown error occurred" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
