import { Context } from "elysia";
import { ScanFoodSchemaType } from "../validators/nutrition.validator";
import { statusCodes, User } from "../types/types";
import { SuccessResponse } from "../utils/response.utils";  

export const scanFoodController = async ({
  body,
  user,
}: Context<{ body: ScanFoodSchemaType }> & { user: User }) => {
    const {image , mealType} = body;
    

    return SuccessResponse("Food scannned successfully", {
        name: "apple",
        servingSize: "1 apple",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fats: 0.3,
        fiber: 4.4,
        sugar: 19,
        sodium: 2,
        cholesterol: 0,
        vitaminA: 54,
        vitaminC: 8.4,
        vitaminB6: 0.1,
        iron: 0.2,
        potassium: 195,
        calcium: 11,
        healthScore: 85,
        imageUrl: {
            url: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBwbGV8ZW58MHx8MHx8fDA%3D",
            public_id: "1234567890",
        },
        tags: ["fruit", "healthy"],
        mealType: mealType,
    }, statusCodes.SUCCESS, "FOOD_SCANNED_SUCCESSFULLY");
};
