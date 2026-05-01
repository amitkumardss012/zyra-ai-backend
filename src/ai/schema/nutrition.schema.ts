import { z } from "zod";

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

// Schema for Assessment Output
export const assessmentOutputSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      type: z.enum(["text", "number", "select"]),
      options: z.array(z.string()).optional(),
      isMandatory: z.boolean(),
    })
  ),
});

// Schema for Plan Output
export const planOutputSchema = z.object({
  dailyCalories: z.number(),
  proteinGrams: z.number(),
  carbsGrams: z.number(),
  fatsGrams: z.number(),
  durationDays: z.number(),
  dietSchedule: z.array(
    z.object({
      mealName: z.string(),
      time: z.string(),
      items: z.array(z.string()),
      calories: z.number(),
    })
  ),
  workoutRoutine: z.array(
    z.object({
      day: z.string(),
      focus: z.string(),
      exercises: z.array(
        z.object({
          name: z.string(),
          sets: z.number(),
          reps: z.string(),
          notes: z.string().optional(),
        })
      ),
    })
  ),
  guidelines: z.object({
    toEat: z.array(z.string()),
    toAvoid: z.array(z.string()),
    tips: z.array(z.string()),
  }),
});

export type NutritionOutput = z.infer<typeof nutritionOutputSchema>;
export type AssessmentOutput = z.infer<typeof assessmentOutputSchema>;
export type PlanOutput = z.infer<typeof planOutputSchema>;