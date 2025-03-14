-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otp" INTEGER,
    "role" TEXT NOT NULL,
    "image" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "product" JSONB NOT NULL,
    "fatherName" TEXT,
    "husbandName" TEXT,
    "gender" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "cnicFrontPhoto" TEXT NOT NULL,
    "cnicBackPhoto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "livingSince" TEXT NOT NULL,
    "residenceType" TEXT NOT NULL,
    "jobTitle" TEXT,
    "occupation" TEXT,
    "occupationStatus" TEXT NOT NULL,
    "organizationName" TEXT,
    "organizationAddress" TEXT,
    "workingSince" TEXT,
    "phoneOffice" TEXT,
    "earningPerMonth" DOUBLE PRECISION,
    "sixMonthBankStatement" TEXT NOT NULL,
    "lastPaySlip" TEXT NOT NULL,
    "utilityBill" TEXT NOT NULL,
    "referenceInfo" JSONB NOT NULL,
    "status" TEXT DEFAULT 'Pending',
    "creditscore" TEXT,
    "loanofficerattachments" JSONB,
    "creditofficerattachments" JSONB,
    "forwardedtocm" BOOLEAN NOT NULL,
    "signaturepdf" JSONB,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallmentPlan" (
    "id" INTEGER NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "originalPrice" DOUBLE PRECISION NOT NULL,
    "downPayment" DOUBLE PRECISION NOT NULL,
    "remainingAmount" DOUBLE PRECISION NOT NULL,
    "selectedPlan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstallmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallmentPlanPayment" (
    "consumerNumber" TEXT NOT NULL,
    "installmentPlanId" INTEGER NOT NULL,
    "BillStatus" TEXT DEFAULT 'U',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "AmountwithinDueDate" INTEGER NOT NULL,
    "AmountAfterDueDate" INTEGER NOT NULL,
    "DatePaid" TEXT,
    "BillingMonth" INTEGER,
    "AmountPaid" INTEGER,
    "TransAuthId" INTEGER,
    "Reserved" TEXT,

    CONSTRAINT "InstallmentPlanPayment_pkey" PRIMARY KEY ("consumerNumber")
);

-- CreateTable
CREATE TABLE "OnelinkAuth" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "OnelinkAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "TransAuthId" INTEGER NOT NULL,
    "consumerNumber" TEXT NOT NULL,
    "TransactionAmount" TEXT NOT NULL,
    "TranDate" TEXT NOT NULL,
    "TranTime" TEXT NOT NULL,
    "BankMnemonic" TEXT NOT NULL,
    "Reserved" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_cnic_key" ON "User"("cnic");

-- CreateIndex
CREATE UNIQUE INDEX "Application_id_key" ON "Application"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentPlan_id_key" ON "InstallmentPlan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentPlan_applicationId_key" ON "InstallmentPlan"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentPlanPayment_TransAuthId_key" ON "InstallmentPlanPayment"("TransAuthId");

-- CreateIndex
CREATE UNIQUE INDEX "OnelinkAuth_username_key" ON "OnelinkAuth"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionHistory_TransAuthId_key" ON "TransactionHistory"("TransAuthId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentPlanPayment" ADD CONSTRAINT "InstallmentPlanPayment_installmentPlanId_fkey" FOREIGN KEY ("installmentPlanId") REFERENCES "InstallmentPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_TransAuthId_fkey" FOREIGN KEY ("TransAuthId") REFERENCES "InstallmentPlanPayment"("TransAuthId") ON DELETE RESTRICT ON UPDATE CASCADE;
