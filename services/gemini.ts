// services/gemini.ts

import { AIService, ChatMessage } from '../types';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`;

export const geminiService: AIService = {
  name: 'Google Gemini',
  async *chat(messages: ChatMessage[]) {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))
      }),
    });

    const result = await response.json();
    if (result.error) {
      throw new Error(`Gemini Error: ${result.error.message}`);
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      yield text;
    } else {
      throw new Error("No se pudo obtener una respuesta de Gemini.");
    }
  },
};