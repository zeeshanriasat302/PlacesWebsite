/*
  Warnings:

  - You are about to drop the column `userid` on the `Place` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_userid_fkey";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "userid",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
