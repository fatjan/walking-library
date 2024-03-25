/*
  Warnings:

  - You are about to drop the column `borrowerId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `borrowerId` on the `Borrow` table. All the data in the column will be lost.
  - Added the required column `bookId` to the `Borrow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Borrow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_borrowerId_fkey";

-- DropForeignKey
ALTER TABLE "Borrow" DROP CONSTRAINT "Borrow_borrowerId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "borrowerId";

-- AlterTable
ALTER TABLE "Borrow" DROP COLUMN "borrowerId",
ADD COLUMN     "bookId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_BookToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookToUser_AB_unique" ON "_BookToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToUser_B_index" ON "_BookToUser"("B");

-- AddForeignKey
ALTER TABLE "Borrow" ADD CONSTRAINT "Borrow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrow" ADD CONSTRAINT "Borrow_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToUser" ADD CONSTRAINT "_BookToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToUser" ADD CONSTRAINT "_BookToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
