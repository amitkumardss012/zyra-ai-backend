import { Elysia } from "elysia";
import userRoute from "../module/user/routes";
import nutritionRoutes from "./nutrition.routes";

const router = new Elysia({ prefix: "/api/v1" })
  .use(userRoute)
  .use(nutritionRoutes);

export default router;
