/*
  Warnings:

  - You are about to drop the column `dong` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `fullAdress` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `gu` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `si` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "dong",
DROP COLUMN "fullAdress",
DROP COLUMN "gu",
DROP COLUMN "si",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "fullAddress" TEXT,
ADD COLUMN     "province" TEXT;
