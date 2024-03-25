-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT true;
