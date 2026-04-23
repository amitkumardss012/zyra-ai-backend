import { Elysia } from "elysia";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const app = new Elysia({ prefix: "/user" });

app.use(authRoutes).use(userRoutes);

export default app;
