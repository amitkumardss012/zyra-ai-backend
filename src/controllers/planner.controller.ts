import { HumanMessage } from "@langchain/core/messages";
import { Context } from "elysia";
import { googleGenAIModel, groqModel } from "../ai/llm/model";
import { plannerAssessmentPrompt, plannerGenerationPrompt } from "../ai/llm/prompt";
import { prisma } from "../config/prisma";
import { statusCodes, User } from "../types/types";
import { SuccessResponse } from "../utils/response.utils";
import { z } from "zod";

// Schema for Assessment Output
const assessmentOutputSchema = z.object({
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
const planOutputSchema = z.object({
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

export const generatePlanQuestions = async ({
  body,
}: Context<{ body: { goal: string; description?: string } }>) => {
  const { goal, description } = body;

  const modelWithStructuredOutput = groqModel.withStructuredOutput(
    assessmentOutputSchema
  );

  const aiResponse = await modelWithStructuredOutput.invoke([
    plannerAssessmentPrompt,
    new HumanMessage(`Goal: ${goal}\nDescription: ${description || "None provided"}`),
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

  const modelWithStructuredOutput = groqModel.withStructuredOutput(
    planOutputSchema
  );

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
