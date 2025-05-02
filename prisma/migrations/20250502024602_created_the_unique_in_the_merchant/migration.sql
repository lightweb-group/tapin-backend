/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `merchants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "phoneNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "merchants_phoneNumber_key" ON "merchants"("phoneNumber");
