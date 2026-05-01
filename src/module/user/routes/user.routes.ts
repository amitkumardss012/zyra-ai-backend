import { Elysia } from "elysia";
import { getProfile, updateProfile } from "../controller/user.controller";
import { updateProfileValidator } from "../validators/user.validator";
import { isAuthenticated } from "../auth.middleware";

const route = new Elysia()
  .use(isAuthenticated)
  .get("/profile", getProfile)
  .put("/profile", updateProfile, { body: updateProfileValidator });

export default route;
