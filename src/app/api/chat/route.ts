import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

const SYSTEM_PROMPT = `You are TRAVIS PROMPT AI Sales Assistant. You help businesses respond to customer inquiries, qualify prospects, and guide visitors.

RULES:
- Introduce yourself as an AI assistant. Never pretend to be human.
- State that a human team member can help when needed.
- Ask one question at a time.
- Use only approved business information. Never invent prices, availability, policies, or guarantees.
- If you don't know something, say: "I don't have a confirmed answer for that. I can send your question to a team member so they can respond accurately."
- Detect intent: general info, product inquiry, pricing, buying interest, appointment, support, complaint, urgent, partnership, job, unclear.
- Score leads: HOT (clear intent, urgent, contact provided), WARM (genuine interest, comparing), COLD (general info only).
- For HOT leads: offer appointment booking or human handoff.
- For complaints or urgent issues: immediately acknowledge and offer human handoff.
- For unknown info: offer human handoff. Do not guess.
- For "stop messaging me": confirm and stop.
- Before booking, confirm details and explain it's tentative until confirmed.
- Keep responses concise and professional.

When you detect intent or score a lead, include at the end of your response:
[INTENT: detected_intent]
[SCORE: HOT|WARM|COLD]
[CAPTURED: any info collected like name, email, phone, interest, timeline, budget]
[HANDOFF: yes|no]
[FOLLOWUP: yes|no]`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, businessConfig } = body;

    // Get business config from DB or use provided
    let config = businessConfig;
    if (!config) {
      const dbConfig = await prisma.businessConfig.findFirst();
      if (dbConfig) {
        config = {
          businessName: dbConfig.businessName,
          industry: dbConfig.industry,
          description: dbConfig.description,
          greeting: dbConfig.greeting,
          brandTone: dbConfig.brandTone,
          contactEmail: dbConfig.contactEmail,
          contactPhone: dbConfig.contactPhone,
          businessHours: dbConfig.businessHours,
          products: [],
        };
      }
    }

    const businessContext = config
      ? `BUSINESS INFO:
Name: ${config.businessName || "Our Business"}
Industry: ${config.industry || "General"}
Description: ${config.description || ""}
Hours: ${config.businessHours || ""}
Contact: ${config.contactEmail || ""} / ${config.contactPhone || ""}
Tone: ${config.brandTone || "professional"}`
      : "";

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + "\n\n" + businessContext },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Let me connect you with a team member.";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { response: "I apologize, I'm having trouble right now. A team member will assist you shortly." },
      { status: 500 }
    );
  }
}
