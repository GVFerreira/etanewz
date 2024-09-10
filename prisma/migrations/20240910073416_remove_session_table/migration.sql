/*
  Warnings:

  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visasession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `visasession` DROP FOREIGN KEY `VisaSession_sessionId_fkey`;

-- DropForeignKey
ALTER TABLE `visasession` DROP FOREIGN KEY `VisaSession_visaId_fkey`;

-- DropTable
DROP TABLE `session`;

-- DropTable
DROP TABLE `visasession`;
