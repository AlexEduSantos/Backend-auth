/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Schedule_userId_key" ON "public"."Schedule"("userId");
