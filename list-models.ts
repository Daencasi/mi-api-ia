// list-models.ts

// Tu API Key de Gemini
const API_KEY = process.env.GOOGLE_AI_API_KEY;

// La URL para listar todos los modelos disponibles
const LIST_MODELS_URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listAvailableModels() {
  console.log("🔍 Investigando qué modelos de Gemini tienes disponibles...");
  try {
    const response = await fetch(LIST_MODELS_URL);
    if (!response.ok) {
      throw new Error(`Error al listar modelos: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    console.log("\n✅ Modelos disponibles para tu API Key:\n");

    // Filtramos para mostrar solo los modelos que pueden generar contenido
    const generativeModels = data.models.filter((model: any) =>
      model.supportedGenerationMethods?.includes("generateContent")
    );

    if (generativeModels.length === 0) {
      console.log("❌ No se encontraron modelos que puedan generar contenido.");
      return;
    }

    generativeModels.forEach((model: any) => {
      console.log(`- Nombre: ${model.name}`);
      console.log(`  Versión: ${model.version}`);
      console.log(`  Mostrar nombre: ${model.displayName}`);
      console.log(`  Descripción: ${model.description}`);
      console.log("---");
    });

  } catch (error) {
    console.error("\n❌ No se pudo conectar con la API de Google para listar los modelos.");
    console.error("El error fue:", error);
  }
}

// Ejecutamos nuestra investigación
listAvailableModels();