/*
  Warnings:

  - You are about to drop the column `emailSentAd` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "emailSentAd",
ADD COLUMN     "emailSendAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "password" DROP NOT NULL;
