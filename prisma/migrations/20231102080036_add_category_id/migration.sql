/*
  Warnings:

  - You are about to drop the column `umur` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "category_id" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "umur",
ADD COLUMN     "age" TEXT;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
