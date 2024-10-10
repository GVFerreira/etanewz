-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "visas" (
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
    "medical_treatment" BOOLEAN NOT NULL,
    "been_deported" BOOLEAN NOT NULL,
    "forbidden_enter" BOOLEAN NOT NULL,
    "been_convicted" BOOLEAN NOT NULL,
    "code_eta" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_checkout" TEXT NOT NULL,
    "id_client" INTEGER NOT NULL,
    "id_order" TEXT NOT NULL,
    "transaction_amount" REAL NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "docType" TEXT NOT NULL DEFAULT 'CPF',
    "doc_number" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "status_details" TEXT NOT NULL,
    "payment_type_id" TEXT NOT NULL,
    "installments" INTEGER NOT NULL,
    "qr_code" TEXT NOT NULL,
    "qr_code_base_64" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "visa_payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentId" TEXT NOT NULL,
    "visasId" TEXT NOT NULL,
    CONSTRAINT "visa_payment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "visa_payment_visasId_fkey" FOREIGN KEY ("visasId") REFERENCES "visas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "visas_code_eta_key" ON "visas"("code_eta");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");
