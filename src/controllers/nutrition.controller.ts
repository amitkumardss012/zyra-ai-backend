import { HumanMessage } from "@langchain/core/messages";
import { Context } from "elysia";
import { googleGenAIModel } from "../ai/llm/model";
import { foodScanPrompt } from "../ai/llm/prompt";
import { nutritionOutputSchema } from "../ai/schema/nutrition.schema";
import { uploadOnCloudinary } from "../config/cloudinary";
import { prisma } from "../config/prisma";
import { statusCodes, User } from "../types/types";
import { SuccessResponse } from "../utils/response.utils";
import { ScanFoodSchemaType } from "../validators/nutrition.validator";
import { nutritionAgent } from "../ai/llm/agent";

export const scanFoodController = async ({
  body,
  user,
}: Context<{ body: ScanFoodSchemaType }> & { user: User }) => {
  const { image: rawImage, mealType } = body;

  // Strip the Data URL prefix (e.g., "data:image/jpeg;base64,") if it exists
  const image = rawImage.replace(/^data:image\/\w+;base64,/, "");

  // 1. Invoke Vision Model for Analysis FIRST (Using base64 image)
  const modelWithStructuredOutput = googleGenAIModel.withStructuredOutput(
    nutritionOutputSchema,
  );

  const aiResponse = await modelWithStructuredOutput.invoke([
    foodScanPrompt,
    new HumanMessage({
      content: [
        {
          type: "text",
          text: "Analyze this food image and provide detailed nutritional information.",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${image}`,
          },
        },
      ],
    }),
  ]);

  // 2. Upload image to Cloudinary ONLY IF AI analysis succeeded
  const cloudinaryResult = await uploadOnCloudinary(image, "nutrition_scans");

  // 3. Save to Database
  const nutritionLog = await prisma.nutritionLog.create({
    data: {
      userId: user.id, // User ID is BigInt
      name: aiResponse.name,
      servingSize: aiResponse.servingSize,
      calories: aiResponse.calories,
      protein: aiResponse.protein,
      carbs: aiResponse.carbs,
      fats: aiResponse.fats,
      fiber: aiResponse.fiber,
      sugar: aiResponse.sugar,
      sodium: aiResponse.sodium,
      cholesterol: aiResponse.cholesterol,
      vitaminA: aiResponse.vitaminA,
      vitaminC: aiResponse.vitaminC,
      vitaminB6: aiResponse.vitaminB6,
      iron: aiResponse.iron,
      potassium: aiResponse.potassium,
      calcium: aiResponse.calcium,
      healthScore: aiResponse.healthScore,
      imageUrl: cloudinaryResult.url,
      tags: aiResponse.tags,
      mealType: mealType as any,
    },
  });

  // 4. Return Response
  return SuccessResponse(
    "Food scanned and logged successfully",
    {
      ...aiResponse,
      imageUrl: cloudinaryResult,
      id: nutritionLog.id,
      mealType: nutritionLog.mealType,
      createdAt: nutritionLog.createdAt,
    },
    statusCodes.SUCCESS,
    "FOOD_SCANNED_SUCCESSFULLY",
  );
};

export const chatWithNutritionist = async ({
  body,
  user,
}: Context<{ body: { messages:  string} }> & {
  user: User;
}) => {
  const { messages } = body;

  const response = await nutritionAgent.invoke(
    { messages: [new HumanMessage(messages)] },
    { context: { userId: user.id } },
  );

  return SuccessResponse(
    "Chat response",
    response,
    statusCodes.SUCCESS,
    "CHAT_RESPONSE",
  );
};
