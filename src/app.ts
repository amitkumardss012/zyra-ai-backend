import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./routes";
import { logger } from "@bogeychan/elysia-logger";



const app = new Elysia()
  .use(logger())
  .use(
    cors({
      origin: ["http://localhost:3000", "https://zyra-ai-web.vercel.app"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    }),
  )
  .use(
    rateLimit({
      max: 200,
      duration: 60 * 1000, // 1 minute
      errorResponse: Response.json(
        { message: "Too many requests", success: false },
        { status: 429, statusText: "Too Many Requests" },
      ),
    }),
  )
  .onError(errorHandler);

app.get("/", () =>
  Response.json(
    { message: "implemented ci cd", success: true },
    { status: 200, statusText: "OK" },
  ),
);

app.use(router);

export default app;
