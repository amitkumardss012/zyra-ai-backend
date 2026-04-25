import { Elysia } from "elysia";
import { scanFoodController } from "../controllers/nutrition.controller";
import { isAuthenticated } from "../module/user/auth.middleware";
import { scanFoodSchema } from "../validators/nutrition.validator";

const router = new Elysia({ prefix: "/nutrition" })
  .use(isAuthenticated)
  .post("/scan-food", scanFoodController, { body: scanFoodSchema });

export default router;
