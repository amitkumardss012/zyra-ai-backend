import { z } from "zod";

export const scanFoodSchema = z.object({
  imageBase64: z.string(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
});

export type ScanFoodInput = z.infer<typeof scanFoodSchema>;

export const nutritionOutputSchema = z.object({
  name: z.string().describe("Name of the food item"),
  servingSize: z.string().optional().describe("Estimated serving size"),
  calories: z.number().describe("Calories in kcal"),
  protein: z.number().describe("Protein in grams"),
  carbs: z.number().describe("Carbohydrates in grams"),
  fats: z.number().describe("Fats in grams"),
  fiber: z.number().optional().describe("Fiber in grams"),
  sugar: z.number().optional().describe("Sugar in grams"),
  sodium: z.number().optional().describe("Sodium in milligrams"),
  cholesterol: z.number().optional().describe("Cholesterol in milligrams"),
  vitaminA: z.number().optional().describe("Vitamin A in mcg"),
  vitaminC: z.number().optional().describe("Vitamin C in mg"),
  vitaminB6: z.number().optional().describe("Vitamin B6 in mg"),
  iron: z.number().optional().describe("Iron in mg"),
  potassium: z.number().optional().describe("Potassium in mg"),
  calcium: z.number().optional().describe("Calcium in mg"),
  healthScore: z.number().min(0).max(100).describe("Health score from 0-100"),
  tags: z.array(z.string()).describe("AI generated tags like High Protein, Low Fat, etc.")
});

export type NutritionOutput = z.infer<typeof nutritionOutputSchema>;