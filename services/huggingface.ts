// services/huggingface.ts

import { AIService, ChatMessage } from '../types';

// La URL del router de Hugging Face, que es compatible con el formato de OpenAI
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

export const huggingFaceService: AIService = {
  name: 'Hugging Face (Mistral)',
  async *chat(messages: ChatMessage[]) {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      // El router de HF espera el formato de OpenAI
      body: JSON.stringify({
        model: "HuggingFaceH4/zephyr-7b-beta",
        messages: messages, // Le pasamos los mensajes directamente
        max_tokens: 500, // Añadimos un límite para no exceder la cuota
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hugging Face API Error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    // El formato de respuesta también es como el de OpenAI
    const text = result.choices?.[0]?.message?.content;
    if (text) {
      yield text;
    } else {
      throw new Error("No se pudo obtener una respuesta de Hugging Face.");
    }
  },
};