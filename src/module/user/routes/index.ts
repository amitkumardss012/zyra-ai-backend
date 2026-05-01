import { Elysia } from "elysia";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const userRoute = new Elysia({ prefix: "/user" })
  .use(authRoutes)
  .use(userRoutes);

export default userRoute;