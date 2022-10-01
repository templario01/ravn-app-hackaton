/*
  Warnings:

  - You are about to drop the column `userId` on the `workspace` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "workspace" DROP CONSTRAINT "workspace_userId_fkey";

-- DropIndex
DROP INDEX "workspace_userId_key";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "workspaceId" TEXT;

-- AlterTable
ALTER TABLE "workspace" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
