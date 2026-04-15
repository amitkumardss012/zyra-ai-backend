import { Elysia } from "elysia";
import userRoutes from "./module/user/routes";

const router = new Elysia({ prefix: "/api/v1" });


router.use(userRoutes);


export default router;