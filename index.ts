// index.ts

import { serve } from "bun";
import { AIService, ChatMessage } from './types';
//import { huggingFaceService } from './services/huggingface';
import { geminiService } from './services/gemini';

// --- CONFIGURACIÓN DEL DIRECTOR DE ORQUESTA ---

// Lista de todos los servicios de IA disponibles en la nube
const aiServices: AIService[] = [
  //huggingFaceService,
  geminiService,
];

let currentServiceIndex = 0;

function getNextService(): AIService {
  const service = aiServices[currentServiceIndex];
  console.log(`🤖 Using service: ${service.name}`);
  currentServiceIndex = (currentServiceIndex + 1) % aiServices.length; // Rota al siguiente
  return service;
}

// --- INICIO DEL SERVIDOR ---

const server = serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/chat') {
      try {
        const { messages } = await request.json() as { messages: ChatMessage[] };
        if (!messages) {
          return new Response(JSON.stringify({ error: 'Messages are required' }), { status: 400 });
        }

        const aiService = getNextService();

        // Creamos una respuesta de "streaming" (aunque algunos servicios la den entera)
        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            try {
              for await (const chunk of aiService.chat(messages)) {
                controller.enqueue(encoder.encode(chunk));
              }
            } catch (error) {
              console.error("Error in AI service stream:", error);
              controller.error(error);
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
      }
    }

    return new Response("Not Found. Please use POST /chat", { status: 404 });
  },
});

console.log(`🚀 Servidor corriendo en http://localhost:${server.port}`);