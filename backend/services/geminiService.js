// Cliente Gemini AI usando @google/genai
const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY no configurada — el chatbot devolverá errores');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Eres Takio AI, asistente experto en gestión de proyectos Scrum, tareas y productividad.
Ayudas a estudiantes universitarios, freelancers y equipos pequeños a estructurar sus proyectos y organizar tareas.
Responde SIEMPRE en español, de forma breve y accionable. Cuando te pidan estructurar un proyecto, sugiere tareas claras, medibles y con prioridad.`;

/**
 * Conversación libre con historial.
 * @param {Array<{role:'user'|'assistant', content:string}>} history
 * @param {string} userMessage
 * @returns {Promise<string>} respuesta del modelo
 */
async function chat(history, userMessage) {
  const contents = [];
  (history || []).forEach((m) => {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    });
  });
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: { systemInstruction: SYSTEM_INSTRUCTION },
  });
  return response.text || 'Lo siento, no pude generar una respuesta.';
}

/**
 * Genera una estructura de proyecto (nombre, descripción, 5-8 tareas) en JSON.
 * @param {string} ideaPrompt
 * @returns {Promise<{project_name:string, description:string, tasks:Array<{title:string,description:string,priority:string}>}>}
 */
async function generateProjectStructure(ideaPrompt) {
  const prompt = `Dada la siguiente idea de proyecto, devuelve ESTRICTAMENTE un JSON válido
(sin texto adicional, sin backticks), con la forma:
{
  \"project_name\": \"string (nombre del proyecto, máx 60 chars)\",
  \"description\":  \"string (descripción en 1-2 frases)\",
  \"tasks\": [
    {
      \"title\":       \"string (máx 80 chars)\",
      \"description\": \"string\",
      \"priority\":    \"LOW\" | \"MEDIUM\" | \"HIGH\"
    }
  ]
}
Genera entre 5 y 8 tareas concretas, accionables y ordenadas lógicamente para una metodología Scrum.

Idea del usuario: ${ideaPrompt}`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
    },
  });

  let text = response.text || '{}';
  // limpieza defensiva por si el modelo ignora el mime-type
  text = text.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();

  const parsed = JSON.parse(text);
  parsed.tasks = Array.isArray(parsed.tasks) ? parsed.tasks.slice(0, 10) : [];
  return parsed;
}

module.exports = { chat, generateProjectStructure };