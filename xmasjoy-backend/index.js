import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    console.log("🔹 /api/chat prompt:", String(prompt).slice(0, 50));

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    let reply = response.text || "";

    // 🔥 清除 ```json、```，避免破壞 JSON.parse
    reply = reply.replace(/^```json\s*/i, "");
    reply = reply.replace(/^```\s*/i, "");
    reply = reply.replace(/\s*```$/i, "");
    reply = reply.trim();

    console.log("🔹 Clean reply:", reply.slice(0, 80));

    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini API Error:", err);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend listening at http://localhost:${port}`);
});
