const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function chat(history, userMessage) {
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
  });

  const contents = (history || []).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const result = await model.generateContent({ contents });
  return result.response.text();
}

module.exports = { chat };