import { createAgent } from "langchain";
import { groqModel } from "./model";


const foodNutritionAgent = createAgent({
  model: groqModel,
  tools: [],
  systemPrompt: `
You are a world-class food nutritionist.
Your task is to analyze the food image and determine
its nutritional value, calories, health score, and relevant dietary information.
Return the result in JSON format with the following fields:
- name: string (name of the food item)
- calories: number (approximate calories)
- protein: number (in grams)
- carbs: number (in grams)
- fats: number (in grams)
- healthScore: number (out of 100)
- tags: array of strings (e.g., "healthy", "junk", "fruit", "protein-rich")
- otherNutrients: object with optional nutrient details
`,
});