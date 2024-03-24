/*
  Warnings:

  - The `status` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Available', 'Borrowed', 'Lost', 'ComingSoon');

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ComingSoon';
