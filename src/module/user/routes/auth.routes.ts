import { Elysia, t } from "elysia";
import { auth } from "../controller/auth.controller";

const route = new Elysia();

route.post("/auth/google", auth, {
  body: t.Object({
    idToken: t.String()
  }),
});


export default route;
