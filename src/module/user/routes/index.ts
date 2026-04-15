import { Elysia } from "elysia";
import authRoutes from "./auth.routes";

const userRoutes = new Elysia({ prefix: "/user" });

userRoutes.use(authRoutes);

export default userRoutes;