-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateTable
CREATE TABLE "NutritionLog" (
    "id" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "servingSize" TEXT,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fats" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,
    "cholesterol" DOUBLE PRECISION,
    "vitaminA" DOUBLE PRECISION,
    "vitaminC" DOUBLE PRECISION,
    "vitaminB6" DOUBLE PRECISION,
    "iron" DOUBLE PRECISION,
    "potassium" DOUBLE PRECISION,
    "calcium" DOUBLE PRECISION,
    "healthScore" INTEGER,
    "imageUrl" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mealType" "MealType" NOT NULL DEFAULT 'SNACK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NutritionLog_userId_idx" ON "NutritionLog"("userId");

-- CreateIndex
CREATE INDEX "NutritionLog_createdAt_idx" ON "NutritionLog"("createdAt");

-- AddForeignKey
ALTER TABLE "NutritionLog" ADD CONSTRAINT "NutritionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
