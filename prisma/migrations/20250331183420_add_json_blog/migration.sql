/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ProjectMember` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `ProjectMember` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `ProjectMember` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ProjectMember` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProjectMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteCode]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,userId]` on the table `ProjectMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ProjectMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProjectMember_projectId_memberId_key";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "inviteCode" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "projectBlog" JSONB;

-- AlterTable
ALTER TABLE "ProjectMember" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "memberId",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'member';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "dueDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userBlog" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Company_inviteCode_key" ON "Company"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_projectId_userId_key" ON "ProjectMember"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
