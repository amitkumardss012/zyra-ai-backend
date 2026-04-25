/*
  Warnings:

  - The `imageUrl` column on the `NutritionLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "NutritionLog" ADD COLUMN     "otherNutrients" JSONB,
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" JSONB;
