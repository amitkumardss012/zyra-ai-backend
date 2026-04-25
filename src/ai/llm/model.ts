import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ENV } from "../../config/env";
import { ChatGroq } from "@langchain/groq";

export const googleGenAIModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: ENV.googleApiKey,
  maxOutputTokens: 2000,
  maxRetries: 1,
});

export const groqModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: ENV.groqApiKey,
  maxTokens: 2000,
  maxRetries: 1,
});
