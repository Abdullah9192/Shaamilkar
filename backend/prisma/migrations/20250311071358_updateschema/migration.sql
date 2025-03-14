/*
  Warnings:

  - You are about to drop the `InstallmentPlanPayment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `installments` to the `InstallmentPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InstallmentPlanPayment" DROP CONSTRAINT "InstallmentPlanPayment_installmentPlanId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionHistory" DROP CONSTRAINT "TransactionHistory_TransAuthId_fkey";

-- AlterTable
ALTER TABLE "InstallmentPlan" ADD COLUMN     "bankmnemonic" TEXT,
ADD COLUMN     "installments" JSONB NOT NULL,
ADD COLUMN     "reserved" TEXT;

-- AlterTable
ALTER TABLE "TransactionHistory" ALTER COLUMN "TransAuthId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "otp" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "InstallmentPlanPayment";
