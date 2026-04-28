import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ENV } from "../../config/env";
import { ChatGroq } from "@langchain/groq";

export const googleGenAIModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: ENV.googleApiKey,
  maxOutputTokens: 8192, // Sufficient for long JSON plans
  maxRetries: 2,
  temperature: 0.2,
});

export const groqModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: ENV.groqApiKey,
  maxTokens: 10000,
  maxRetries: 1,
});


// Example test call (optional, usually removed in production)
// groqModel.invoke([
//   nutritionAgentPrompt,
//   {
//     role: 'user',
//     content: 'Analyze my nutrition'
//   }
// ]).then(console.log).catch(console.error);