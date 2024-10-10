/*
  Warnings:

  - You are about to drop the column `installments` on the `payments` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_client" INTEGER NOT NULL,
    "id_order" TEXT NOT NULL,
    "transaction_amount" REAL NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "docType" TEXT NOT NULL DEFAULT 'CPF',
    "doc_number" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "payment_type_id" TEXT NOT NULL,
    "qr_code" TEXT,
    "qr_code_base_64" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_payments" ("created_at", "docType", "doc_number", "id", "id_client", "id_order", "payment_type_id", "qr_code", "qr_code_base_64", "status", "transaction_amount", "transaction_id") SELECT "created_at", "docType", "doc_number", "id", "id_client", "id_order", "payment_type_id", "qr_code", "qr_code_base_64", "status", "transaction_amount", "transaction_id" FROM "payments";
DROP TABLE "payments";
ALTER TABLE "new_payments" RENAME TO "payments";
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
