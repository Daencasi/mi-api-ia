// services/cerebras.ts

import { AIService, ChatMessage } from '../types';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

// Inicializamos el cliente de Cerebras con nuestra clave secreta
const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export const cerebrasService: AIService = {
  name: 'Cerebras',
  async *chat(messages: ChatMessage[]) {
    try {
      // Usamos el SDK para llamar a la API, igual que en tu ejemplo
      const stream = await cerebras.chat.completions.create({
        messages: messages,
        model: 'llama3.1-8b', // Un modelo rápido y potente de Cerebras
        stream: true,
      });

      // Iteramos sobre cada trozo de la respuesta que nos llega
      for await (const chunk of stream) {
        // Extraemos el contenido del trozo, igual que en tu ejemplo
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          // "Yield" envía cada trocito de texto en cuanto lo recibe
          yield content;
        }
      }
    } catch (error) {
      // Si algo falla, lanzamos un error claro
      throw new Error(`Cerebras API Error: ${error.message}`);
    }
  },
};