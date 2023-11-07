-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jabatan_id" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_jabatan_id_fkey" FOREIGN KEY ("jabatan_id") REFERENCES "Jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
