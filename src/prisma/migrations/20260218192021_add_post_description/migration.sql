-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "description" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
