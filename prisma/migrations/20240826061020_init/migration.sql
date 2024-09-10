-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visas` (
    `id` VARCHAR(191) NOT NULL,
    `passport_nationality` VARCHAR(191) NOT NULL,
    `passport_issuer` VARCHAR(191) NOT NULL,
    `passport_number` VARCHAR(191) NOT NULL,
    `passport_expiration` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NOT NULL,
    `had_other_name` BOOLEAN NOT NULL,
    `other_name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `date_birth` DATETIME(3) NOT NULL,
    `city_birth` VARCHAR(191) NOT NULL,
    `country_birth` VARCHAR(191) NOT NULL,
    `national_document` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `medical_treatment` BOOLEAN NOT NULL,
    `been_deported` BOOLEAN NOT NULL,
    `forbidden_enter` BOOLEAN NOT NULL,
    `been_convicted` BOOLEAN NOT NULL,
    `code_eta` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `visas_email_key`(`email`),
    UNIQUE INDEX `visas_code_eta_key`(`code_eta`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `payments_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `destination_category` (
    `id` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `visasId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `destination_category` ADD CONSTRAINT `destination_category_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `destination_category` ADD CONSTRAINT `destination_category_visasId_fkey` FOREIGN KEY (`visasId`) REFERENCES `visas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
