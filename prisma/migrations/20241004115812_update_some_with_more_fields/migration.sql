/*
  Warnings:

  - Added the required column `convicted_more_than_five` to the `visas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `convicted_more_than_twelve` to the `visas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath` to the `visas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `return_to_australia` to the `visas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stay_in_nz` to the `visas` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_visas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passport_nationality" TEXT NOT NULL,
    "passport_issuer" TEXT NOT NULL,
    "passport_number" TEXT NOT NULL,
    "passport_expiration" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "had_other_name" BOOLEAN NOT NULL,
    "other_name" TEXT,
    "gender" TEXT NOT NULL,
    "date_birth" DATETIME NOT NULL,
    "city_birth" TEXT NOT NULL,
    "country_birth" TEXT NOT NULL,
    "national_document" TEXT,
    "email" TEXT NOT NULL,
    "return_to_australia" BOOLEAN NOT NULL,
    "stay_in_nz" BOOLEAN NOT NULL,
    "medical_treatment" BOOLEAN NOT NULL,
    "been_deported" BOOLEAN NOT NULL,
    "forbidden_enter" BOOLEAN NOT NULL,
    "been_convicted" BOOLEAN NOT NULL,
    "convicted_more_than_five" BOOLEAN NOT NULL,
    "convicted_more_than_twelve" BOOLEAN NOT NULL,
    "code_eta" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_visas" ("been_convicted", "been_deported", "city_birth", "code_eta", "country_birth", "created_at", "date_birth", "email", "forbidden_enter", "gender", "had_other_name", "id", "medical_treatment", "name", "national_document", "other_name", "passport_expiration", "passport_issuer", "passport_nationality", "passport_number", "surname") SELECT "been_convicted", "been_deported", "city_birth", "code_eta", "country_birth", "created_at", "date_birth", "email", "forbidden_enter", "gender", "had_other_name", "id", "medical_treatment", "name", "national_document", "other_name", "passport_expiration", "passport_issuer", "passport_nationality", "passport_number", "surname" FROM "visas";
DROP TABLE "visas";
ALTER TABLE "new_visas" RENAME TO "visas";
CREATE UNIQUE INDEX "visas_code_eta_key" ON "visas"("code_eta");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
