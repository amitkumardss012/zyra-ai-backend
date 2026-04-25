import { z } from "zod";

export const scanFoodSchema = z.object({
  imageBase64: z.string(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
});

export type ScanFoodInput = z.infer<typeof scanFoodSchema>;