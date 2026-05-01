-- CreateEnum
CREATE TYPE "SkinType" AS ENUM ('OILY', 'DRY', 'COMBINATION', 'SENSITIVE', 'NORMAL');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activityLevel" "ActivityLevel",
ADD COLUMN     "allergies" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "beautyGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "dietaryPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "healthGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "skinConcerns" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "skinType" "SkinType";
