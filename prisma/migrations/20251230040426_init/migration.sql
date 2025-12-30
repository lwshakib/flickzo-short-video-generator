/*
  Warnings:

  - You are about to drop the column `audioText` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `audioUrl` on the `Video` table. All the data in the column will be lost.
  - Added the required column `audio` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "audioText",
DROP COLUMN "audioUrl",
ADD COLUMN     "audio" JSONB NOT NULL;
