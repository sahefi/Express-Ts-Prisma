-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_user_id_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
