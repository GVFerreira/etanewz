/*
  Warnings:

  - You are about to drop the column `name` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `destination_category` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transaction_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doc_number` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_checkout` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_client` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_order` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installments` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_type_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qr_code` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qr_code_base_64` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_details` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_amount` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `destination_category` DROP FOREIGN KEY `destination_category_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `destination_category` DROP FOREIGN KEY `destination_category_visasId_fkey`;

-- DropIndex
DROP INDEX `payments_slug_key` ON `payments`;

-- DropIndex
DROP INDEX `visas_email_key` ON `visas`;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `name`,
    DROP COLUMN `slug`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `docType` VARCHAR(191) NOT NULL DEFAULT 'CPF',
    ADD COLUMN `doc_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_checkout` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_client` INTEGER NOT NULL,
    ADD COLUMN `id_order` VARCHAR(191) NOT NULL,
    ADD COLUMN `installments` INTEGER NOT NULL,
    ADD COLUMN `payment_type_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `qr_code` TEXT NOT NULL,
    ADD COLUMN `qr_code_base_64` TEXT NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `status_details` VARCHAR(191) NOT NULL,
    ADD COLUMN `transaction_amount` DOUBLE NOT NULL,
    ADD COLUMN `transaction_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `destination_category`;

-- CreateTable
CREATE TABLE `visa_payment` (
    `id` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `visasId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisaSession` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `visaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `payments_transaction_id_key` ON `payments`(`transaction_id`);

-- AddForeignKey
ALTER TABLE `visa_payment` ADD CONSTRAINT `visa_payment_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `visa_payment` ADD CONSTRAINT `visa_payment_visasId_fkey` FOREIGN KEY (`visasId`) REFERENCES `visas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisaSession` ADD CONSTRAINT `VisaSession_visaId_fkey` FOREIGN KEY (`visaId`) REFERENCES `visas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisaSession` ADD CONSTRAINT `VisaSession_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
