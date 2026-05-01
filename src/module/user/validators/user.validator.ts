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
  skinType: t.Optional(
    t.Enum({
      OILY: "OILY",
      DRY: "DRY",
      COMBINATION: "COMBINATION",
      SENSITIVE: "SENSITIVE",
      NORMAL: "NORMAL",
    }),
  ),
  skinConcerns: t.Optional(t.Array(t.String())),
  beautyGoals: t.Optional(t.Array(t.String())),
  activityLevel: t.Optional(
    t.Enum({
      SEDENTARY: "SEDENTARY",
      LIGHTLY_ACTIVE: "LIGHTLY_ACTIVE",
      MODERATELY_ACTIVE: "MODERATELY_ACTIVE",
      VERY_ACTIVE: "VERY_ACTIVE",
      EXTRA_ACTIVE: "EXTRA_ACTIVE",
    }),
  ),
  dietaryPreferences: t.Optional(t.Array(t.String())),
  allergies: t.Optional(t.Array(t.String())),
  healthGoals: t.Optional(t.Array(t.String())),
  metadata: t.Optional(t.Object({})),
});
