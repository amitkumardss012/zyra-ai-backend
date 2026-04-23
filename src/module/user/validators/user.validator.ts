import { t } from "elysia";

export const updateProfileValidator = t.Object({
  gender: t.Optional(
    t.Enum({
      MALE: "MALE",
      FEMALE: "FEMALE",
      OTHER: "OTHER",
      PREFER_NOT_TO_SAY: "PREFER_NOT_TO_SAY",
    }),
  ),
  age: t.Optional(t.Number()),
  height: t.Optional(t.Number()),
  weight: t.Optional(t.Number()),
  dob: t.Optional(t.Date()),
  preferredMode: t.Optional(
    t.Enum({ NUTRITION: "NUTRITION", BEAUTY: "BEAUTY" }),
  ),
  metadata: t.Optional(t.Object({})),
});
