import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// SYSTEM PROMPT / INSTRUCTIONS
const SYSTEM_INSTRUCTION = `
You are 'HistoryVoice AI', an expert, engaging, and friendly historical research & educational assistant.
Your goal is to help students, researchers, and curious minds explore history, rare texts, and cultural events easily.

Guidelines:
1. Provide accurate, well-structured, and concise responses.
2. If the user asks in Roman Urdu, Urdu, or English, reply in the same language/script seamlessly.
3. Keep the tone insightful, academic yet easy to understand, and helpful for students.
4. When explaining historical topics, break them down with clear bullet points where helpful.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    }

    const formattedHistory = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Apologies, I couldn't process that response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in AI Route:', error);
    return NextResponse.json({ error: 'Failed to generate response from AI' }, { status: 500 });
  }
}
