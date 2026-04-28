import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ENV } from "../../config/env";
import { ChatGroq } from "@langchain/groq";

export const googleGenAIModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: ENV.googleApiKey,
  maxOutputTokens: 10000,
  maxRetries: 1,
});

export const groqModel = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: ENV.groqApiKey,
  maxTokens: 2000,
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