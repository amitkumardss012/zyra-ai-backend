import { Elysia, t } from "elysia";
import { auth } from "../controller/auth.controller";

const route = new Elysia();

route.post("/auth", auth, {
  body: t.Object({
    name: t.String({}),
    email: t.String({ email: true }),
    avatar: t.String({ url: true })
  }),
});


export default route;
