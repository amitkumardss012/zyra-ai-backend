import { z } from "zod";

export const scanFoodSchema = z.object({
  image: z.file(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
});

export type ScanFoodInput = z.infer<typeof scanFoodSchema>;
