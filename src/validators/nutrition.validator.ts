import { t } from "elysia";
import { MealType } from "../types/types";

export const scanFoodSchema = t.Object({
    image: t.File({
        maxSize: 10 * 1024 * 1024,
        accept: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    }),
    mealType: t.Enum(MealType),
})

export type ScanFoodSchemaType = typeof scanFoodSchema.static;