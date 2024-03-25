/*
  Warnings:

  - Added the required column `startedAt` to the `Borrow` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BorrowStatus" AS ENUM ('Queued', 'Borrowing', 'Borrowed');

-- AlterTable
ALTER TABLE "Borrow" ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "BorrowStatus" NOT NULL DEFAULT 'Queued',
ALTER COLUMN "expiredAt" DROP DEFAULT;
