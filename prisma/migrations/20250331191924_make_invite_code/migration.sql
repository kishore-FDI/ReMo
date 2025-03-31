/*
  Warnings:

  - Made the column `inviteCode` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "inviteCode" SET NOT NULL;
