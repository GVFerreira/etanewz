-- AlterTable
ALTER TABLE "visas" ADD COLUMN "attachment_path" TEXT;
ALTER TABLE "visas" ADD COLUMN "status_eta" TEXT DEFAULT 'Em análise';
