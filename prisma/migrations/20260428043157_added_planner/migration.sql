-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'COMPLETED');

-- CreateTable
CREATE TABLE "TransformationPlan" (
    "id" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "goal" TEXT NOT NULL,
    "description" TEXT,
    "durationDays" INTEGER NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "dailyCalories" INTEGER NOT NULL,
    "proteinGrams" INTEGER NOT NULL,
    "carbsGrams" INTEGER NOT NULL,
    "fatsGrams" INTEGER NOT NULL,
    "assessment" JSONB NOT NULL,
    "dietSchedule" JSONB NOT NULL,
    "workoutRoutine" JSONB NOT NULL,
    "guidelines" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransformationPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransformationPlan_userId_idx" ON "TransformationPlan"("userId");

-- CreateIndex
CREATE INDEX "TransformationPlan_status_idx" ON "TransformationPlan"("status");

-- AddForeignKey
ALTER TABLE "TransformationPlan" ADD CONSTRAINT "TransformationPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
