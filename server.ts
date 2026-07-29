import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

let groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is missing.");
    }

    groq = new Groq({
      apiKey,
    });
  }

  return groq;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Business Analysis API
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      const { idea, industry, targetAudience } = req.body;

      if (!idea || typeof idea !== "string" || idea.trim().length === 0) {
        res.status(400).json({ error: "A business idea is required." });
        return;
      }
      const ai = getGroqClient();

      const prompt = `
        You are an expert entrepreneurial consultant, VC partner, and patent analyst. 
        Analyze the following business idea and provide a highly detailed, professional validation report.
        
        Business Idea: "${idea}"
        ${industry ? `Industry Context: "${industry}"` : ""}
        ${targetAudience ? `Target Audience/Customer segment: "${targetAudience}"` : ""}

        Conduct rigorous analysis:
        1. Brand Name & Pitch: Recommend a creative, memorable, and available-feeling name for this business along with a high-impact 1-sentence pitch.
        2. Competitors: Identify 3 realistic direct or indirect competitors, estimate their market presence (High, Medium, Niche), describe their strengths and weaknesses, and detail how this proposed business will win against them.
        3. Similar Patents: Search/invent realistic similar patents or Registered Intellectual Property concepts. Provide a plausible registration reference (e.g. USXXXXXXXXB2) or App ID, how they relate, the legal risk level (Low, Medium, High), and actionable design/product workarounds.
        4. Domain Availability: Create 4 highly suitable domain name variations across .com, .ai, .io, .co with availability estimates and why they match.
        5. Market Size (TAM, SAM, SOM): Estimate reasonable values in millions of USD with sound economic reasoning. TAM (Total market), SAM (your reachable segment), SOM (your target capture within 2-3 years). Provide numerical values (in millions) for charts.
        6. Monetization: Detail 3 realistic pricing or revenue strategies (e.g., subscription tiering, transactional fees, freemium upsell) with pros and cons.
        7. SWOT: Provide 4 key items for each SWOT category (Strengths, Weaknesses, Opportunities, Threats).
        8. Launch Strategy: Provide a step-by-step roadmap divided into 3 execution phases with clear timelines, key milestones, and launch marketing tactics.

        Ensure all estimates, market metrics, similar patent records, and competitors sound highly realistic, data-informed, and practical.
      `;

      const completion = await ai.chat.completions.create({
 model: "llama-3.3-70b-versatile",
  messages: [
    {
  role: "system",
  content: `
You are LaunchLensAI.

Return ONLY valid JSON.

The JSON MUST have exactly this structure:

{
  "businessName": "",
  "elevatorPitch": "",
  "competitors": [
    {
      "name": "",
      "marketShare": "",
      "strengths": [],
      "weaknesses": [],
      "differentiation": ""
    }
  ],
  "patents": [
    {
      "title": "",
      "numberOrRef": "",
      "relation": "",
      "riskLevel": "",
      "workaround": ""
    }
  ],
  "domains": [
    {
      "domainName": "",
      "tld": "",
      "status": "",
      "suitabilityScore": 0,
      "why": ""
    }
  ],
  "marketSize": {
    "tamValue": "",
    "tamDesc": "",
    "samValue": "",
    "samDesc": "",
    "somValue": "",
    "somDesc": "",
    "chartData": [
      {
        "name": "TAM",
        "value": 0,
        "label": ""
      },
      {
        "name": "SAM",
        "value": 0,
        "label": ""
      },
      {
        "name": "SOM",
        "value": 0,
        "label": ""
      }
    ]
  },
  "monetization": [
    {
      "strategyName": "",
      "description": "",
      "pricingSuggestion": "",
      "pros": [],
      "cons": []
    }
  ],
  "swot": {
    "strengths": [],
    "weaknesses": [],
    "opportunities": [],
    "threats": []
  },
  "launchStrategy": [
    {
      "phase": "",
      "timeline": "",
      "milestones": [],
      "tactics": []
    }
  ]
}

Do not wrap the JSON in markdown.
Do not explain the answer.
Do not include \`\`\`json.
Return ONLY the JSON object.
`,
},
    {
      role: "user",
      content: prompt,
    },
  ],
  response_format: {
    type: "json_object",
  },
});

const reportData = JSON.parse(
  completion.choices[0].message.content || "{}"
);
      res.json(reportData);
    } catch (error: any) {
      console.error("Groq business analysis error:", error);
      res.status(500).json({
        error: error.message || "An error occurred during business validation.",
        details: error.toString()
      });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
