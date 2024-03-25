/*
  Warnings:

  - Made the column `borrowerId` on table `Borrow` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Borrow" DROP CONSTRAINT "Borrow_borrowerId_fkey";

-- AlterTable
ALTER TABLE "Borrow" ALTER COLUMN "borrowerId" SET NOT NULL,
ALTER COLUMN "expiredAt" DROP NOT NULL,
ALTER COLUMN "startedAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Borrow" ADD CONSTRAINT "Borrow_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
