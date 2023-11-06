/*
  Warnings:

  - You are about to drop the column `uodateAt` on the `Category` table. All the data in the column will be lost.
  - Added the required column `updateAt` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "uodateAt",
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
