import { HumanMessage } from "@langchain/core/messages";
import { Context } from "elysia";
import { googleGenAIModel, groqModel } from "../ai/llm/model";
import {
  foodScanPrompt,
  nutritionAssistantPrompt,
  plannerAssessmentPrompt,
  plannerGenerationPrompt,
} from "../ai/llm/prompt";
import {
  assessmentOutputSchema,
  nutritionOutputSchema,
  planOutputSchema,
} from "../ai/schema/nutrition.schema";
import { uploadOnCloudinary } from "../config/cloudinary";
import { prisma } from "../config/prisma";
import { statusCodes, User } from "../types/types";
import { SuccessResponse } from "../utils/response.utils";
import { ScanFoodSchemaType } from "../validators/nutrition.validator";

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
}: Context<{ body: { messages: string } }> & {
  user: User;
}) => {
  const { messages } = body;

  const response = await groqModel.invoke([
    nutritionAssistantPrompt,
    new HumanMessage(messages),
  ]);

  return SuccessResponse(
    "Chat response",
    response.content,
    statusCodes.SUCCESS,
    "CHAT_RESPONSE",
  );
};

export const generatePlanQuestions = async ({
  body,
}: Context<{ body: { goal: string; description?: string } }>) => {
  const { goal, description } = body;

  const modelWithStructuredOutput = groqModel.withStructuredOutput(
    assessmentOutputSchema
  );

  const aiResponse = await modelWithStructuredOutput.invoke([
    plannerAssessmentPrompt,
    new HumanMessage(
      `Goal: ${goal}\nDescription: ${description || "None provided"}`
    ),
  ]);

  return SuccessResponse(
    "Assessment questions generated",
    aiResponse.questions,
    statusCodes.SUCCESS,
    "QUESTIONS_GENERATED"
  );
};

export const generateFullPlan = async ({
  body,
  user,
}: Context<{
  body: {
    goal: string;
    description?: string;
    answers: { questionId: string; questionText: string; answer: string }[];
  };
}> & { user: User }) => {
  const { goal, description, answers } = body;

  const modelWithStructuredOutput =
    groqModel.withStructuredOutput(planOutputSchema);

  const aiResponse = await modelWithStructuredOutput.invoke([
    plannerGenerationPrompt,
    new HumanMessage(`
      Goal: ${goal}
      Description: ${description || "None provided"}
      
      User Answers:
      ${answers.map((a) => `Q: ${a.questionText}\nA: ${a.answer}`).join("\n\n")}
    `),
  ]);

  // Save to Database
  const plan = await prisma.transformationPlan.create({
    data: {
      userId: user.id,
      goal,
      description,
      durationDays: aiResponse.durationDays,
      dailyCalories: aiResponse.dailyCalories,
      proteinGrams: aiResponse.proteinGrams,
      carbsGrams: aiResponse.carbsGrams,
      fatsGrams: aiResponse.fatsGrams,
      assessment: answers as any,
      dietSchedule: aiResponse.dietSchedule as any,
      workoutRoutine: aiResponse.workoutRoutine as any,
      guidelines: aiResponse.guidelines as any,
    },
  });

  return SuccessResponse(
    "Transformation plan generated and saved",
    plan,
    statusCodes.SUCCESS,
    "PLAN_GENERATED"
  );
};

export const getCurrentPlan = async ({ user }: { user: User }) => {
  const plan = await prisma.transformationPlan.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return SuccessResponse(
    "Current plan retrieved",
    plan,
    statusCodes.SUCCESS,
    "PLAN_RETRIEVED"
  );
};

export const getAllNutritionLogs = async ({
  query,
  user,
}: Context<{
  query: {
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
  };
}> & { user: User }) => {
  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "10");
  const skip = (page - 1) * limit;

  const where: any = {
    userId: user.id,
  };

  if (query.startDate || query.endDate) {
    where.createdAt = {};
    if (query.startDate) {
      where.createdAt.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      where.createdAt.lte = new Date(query.endDate);
    }
  }

  const [logs, total] = await Promise.all([
    prisma.nutritionLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.nutritionLog.count({ where }),
  ]);

  return SuccessResponse(
    "Nutrition logs retrieved successfully",
    {
      logs,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    },
    statusCodes.SUCCESS,
    "NUTRITION_LOGS_RETRIEVED"
  );
};

export const getAllPlans = async ({
  query,
  user,
}: Context<{
  query: {
    page?: string;
    limit?: string;
  };
}> & { user: User }) => {
  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "10");
  const skip = (page - 1) * limit;

  const where = {
    userId: user.id,
  };

  const [plans, total] = await Promise.all([
    prisma.transformationPlan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.transformationPlan.count({ where }),
  ]);

  return SuccessResponse(
    "Transformation plans retrieved successfully",
    {
      plans,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    },
    statusCodes.SUCCESS,
    "PLANS_RETRIEVED"
  );
};

export const getDashboardData = async ({ user }: { user: User }) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  // 1. Get Current Plan for Goals
  const activePlan = await prisma.transformationPlan.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  const goals = {
    calories: activePlan?.dailyCalories || 2000,
    protein: activePlan?.proteinGrams || 150,
    carbs: activePlan?.carbsGrams || 250,
    fats: activePlan?.fatsGrams || 65,
  };

  // 2. Today's Intake
  const todayLogs = await prisma.nutritionLog.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: todayStart },
    },
  });

  const todayIntake = todayLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + (log.calories || 0),
      protein: acc.protein + (log.protein || 0),
      carbs: acc.carbs + (log.carbs || 0),
      fats: acc.fats + (log.fats || 0),
      fiber: acc.fiber + (log.fiber || 0),
      vitaminC: acc.vitaminC + (log.vitaminC || 0),
      iron: acc.iron + (log.iron || 0),
      calcium: acc.calcium + (log.calcium || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, vitaminC: 0, iron: 0, calcium: 0 }
  );

  // 3. Weekly Performance (Last 7 Days)
  const last7DaysLogs = await prisma.nutritionLog.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: weekStart },
    },
  });

  const weeklyData = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toLocaleDateString("en-US", { weekday: "short" });
    const dStart = new Date(d); dStart.setHours(0, 0, 0, 0);
    const dEnd = new Date(d); dEnd.setHours(23, 59, 59, 999);
    
    const dayCalories = last7DaysLogs
      .filter(l => l.createdAt >= dStart && l.createdAt <= dEnd)
      .reduce((sum, l) => sum + (l.calories || 0), 0);
      
    weeklyData.push({ day: dStr, calories: dayCalories, goal: goals.calories });
  }

  // 4. Recent Logs (Top 4)
  const recentMeals = await prisma.nutritionLog.findMany({
    where: { userId: user.id },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  // 5. Streak & Protein Average
  const avgProtein = last7DaysLogs.length > 0 
    ? Math.round(last7DaysLogs.reduce((sum, l) => sum + (l.protein || 0), 0) / 7) 
    : 0;

  // Streak Calculation
  const last30DaysLogs = await prisma.nutritionLog.findMany({
    where: { userId: user.id, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  
  const logDates = new Set(last30DaysLogs.map(l => l.createdAt.toDateString()));
  let streak = 0;
  let curr = new Date();
  while (logDates.has(curr.toDateString())) {
    streak++;
    curr.setDate(curr.getDate() - 1);
  }

  return SuccessResponse("Dashboard data retrieved successfully", {
    dailyStats: {
      calories: { current: Math.round(todayIntake.calories), goal: goals.calories, unit: "kcal" },
      protein: { current: Math.round(todayIntake.protein), goal: goals.protein, unit: "g" },
      carbs: { current: Math.round(todayIntake.carbs), goal: goals.carbs, unit: "g" },
      fats: { current: Math.round(todayIntake.fats), goal: goals.fats, unit: "g" },
    },
    weeklyData,
    recentMeals: recentMeals.map(m => ({
      id: m.id,
      name: m.name,
      time: m.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      calories: Math.round(m.calories),
      protein: Math.round(m.protein),
      emoji: m.mealType === "BREAKFAST" ? "🥣" : m.mealType === "LUNCH" ? "🥗" : m.mealType === "DINNER" ? "🍽️" : "🥤"
    })),
    nutrientHighlights: [
      { name: "Fiber", amount: `${Math.round(todayIntake.fiber)}g`, target: "25g", color: "from-amber-400 to-orange-500" },
      { name: "Vitamin C", amount: `${Math.round(todayIntake.vitaminC)}mg`, target: "90mg", color: "from-yellow-400 to-amber-500" },
      { name: "Iron", amount: `${Math.round(todayIntake.iron)}mg`, target: "18mg", color: "from-red-400 to-rose-500" },
      { name: "Calcium", amount: `${Math.round(todayIntake.calcium)}mg`, target: "1000mg", color: "from-blue-400 to-indigo-500" },
    ],
    quickStats: [
       { label: "Avg Daily Protein", value: `${avgProtein}g`, change: "+5%", trend: "up" },
       { label: "Meals Logged", value: last7DaysLogs.length, change: "This week", trend: "neutral" },
       { label: "Best Streak", value: `${streak} days`, change: "Current", trend: "up" },
       { label: "Calorie Deficit", value: todayIntake.calories > goals.calories ? `+${Math.round(todayIntake.calories - goals.calories)}` : `${Math.round(todayIntake.calories - goals.calories)}`, change: "kcal/day", trend: todayIntake.calories > goals.calories ? "up" : "down" }
    ]
  });
};


