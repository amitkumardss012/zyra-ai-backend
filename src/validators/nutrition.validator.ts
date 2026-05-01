import { t } from "elysia";
import { MealType } from "../types/types";

export const scanFoodSchema = t.Object({
    image: t.String(),
    mealType: t.Enum(MealType),
})

export type ScanFoodSchemaType = typeof scanFoodSchema.static;