import { Elysia } from "elysia";
import {
  chatWithNutritionist,
  scanFoodController,
} from "../controllers/nutrition.controller";
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
  });

export default router;
