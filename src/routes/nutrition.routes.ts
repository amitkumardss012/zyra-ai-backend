import { Elysia } from "elysia";
import {
  chatWithNutritionist,
  scanFoodController,
} from "../controllers/nutrition.controller";
import {
  generateFullPlan,
  generatePlanQuestions,
  getCurrentPlan,
} from "../controllers/planner.controller";
import { isAuthenticated } from "../module/user/auth.middleware";
import { scanFoodSchema } from "../validators/nutrition.validator";
import { z } from "zod";

const router = new Elysia({ prefix: "/nutrition" })
  .use(isAuthenticated)
  .post("/scan-food", scanFoodController, { body: scanFoodSchema })
  .post("/chat", chatWithNutritionist, {
    body: z.object({
      messages: z.string(),
    }),
  })
  .post("/plan/questions", generatePlanQuestions, {
    body: z.object({
      goal: z.string(),
      description: z.string().optional(),
    }),
  })
  .post("/plan/generate", generateFullPlan, {
    body: z.object({
      goal: z.string(),
      description: z.string().optional(),
      answers: z.array(
        z.object({
          questionId: z.string(),
          questionText: z.string(),
          answer: z.string(),
        })
      ),
    }),
  })
  .get("/plan/current", getCurrentPlan);

export default router;
